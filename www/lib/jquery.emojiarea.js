(function($, window, document) {

	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
	var TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
	var KEY_ESC = 27;
	var KEY_TAB = 9;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	$.emojiarea = {
		path: '',
		icons: {},
		defaults: {
			button: null,
			buttonLabel: 'Emojis',
			buttonPosition: 'after'
		}
	};

	$.fn.emojiarea = function(options) {
		console.log("emoji area", options);
		options = $.extend({}, $.emojiarea.defaults, options);
		return this.each(function() {
			var $textarea = $(this);
			if ('contentEditable' in document.body && options.wysiwyg !== false) {
				new EmojiArea_WYSIWYG($textarea, options);
				console.log("content editable");
				console.log($textarea);
			} else {
				new EmojiArea_Plain($textarea, options);
			}
		});
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var util = {};

	util.restoreSelection = (function() {
		console.log("restore selection?");
		if (window.getSelection) {
			return function(savedSelection) {
				var sel = window.getSelection();
				sel.removeAllRanges();
				for (var i = 0, len = savedSelection.length; i < len; ++i) {
					sel.addRange(savedSelection[i]);
				}
			};
		} else if (document.selection && document.selection.createRange) {
			return function(savedSelection) {
				if (savedSelection) {
					savedSelection.select();
				}
			};
		}
	})();

	util.saveSelection = (function() {
		console.log("save selection?");
		if (window.getSelection) {
			return function() {
				var sel = window.getSelection(), ranges = [];
				if (sel.rangeCount) {
					for (var i = 0, len = sel.rangeCount; i < len; ++i) {
						ranges.push(sel.getRangeAt(i));
					}
				}
				return ranges;
			};
		} else if (document.selection && document.selection.createRange) {
			return function() {
				var sel = document.selection;
				return (sel.type.toLowerCase() !== 'none') ? sel.createRange() : null;
			};
		}
	})();

	util.replaceSelection = (function() {
		console.log("replace selection?");
		if (window.getSelection) {
			return function(content) {
				var range, sel = window.getSelection();
				var node = typeof content === 'string' ? document.createTextNode(content) : content;
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode(document.createTextNode(' '));
					range.insertNode(node);
					console.log(node);
					range.setStart(node, 0);

					window.setTimeout(function() {
						range = document.createRange();
						range.setStartAfter(node);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}, 0);
				}
			}
		} else if (document.selection && document.selection.createRange) {
			return function(content) {
				var range = document.selection.createRange();
				if (typeof content === 'string') {
					range.text = content;
				} else {
					range.pasteHTML(content.outerHTML);
				}
			}
		}
	})();

	util.insertAtCursor = function(text, el) {
		console.log("insert at cursor");
		text = ' ' + text;
		var val = el.value, endIndex, startIndex, range;
		if (typeof el.selectionStart != 'undefined' && typeof el.selectionEnd != 'undefined') {
			startIndex = el.selectionStart;
			endIndex = el.selectionEnd;
			el.value = val.substring(0, startIndex) + text + val.substring(el.selectionEnd);
			el.selectionStart = el.selectionEnd = startIndex + text.length;
		} else if (typeof document.selection != 'undefined' && typeof document.selection.createRange != 'undefined') {
			el.focus();
			range = document.selection.createRange();
			range.text = text;
			range.select();
		}
	};

	util.extend = function(a, b) {
		if (typeof a === 'undefined' || !a) { a = {}; }
		if (typeof b === 'object') {
			for (var key in b) {
				if (b.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
		}
		return a;
	};

	util.escapeRegex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	util.htmlEntities = function(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var EmojiArea = function() {};

	EmojiArea.prototype.setup = function() {
		var self = this;

		this.$editor.on('focus', function() { self.hasFocus = true; });
		this.$editor.on('blur', function() { self.hasFocus = false; });

	};

	EmojiArea.createIcon = function(emoji) {
		var filename = $.emojiarea.icons[emoji];
		var path = $.emojiarea.path || '';
		if (path.length && path.charAt(path.length - 1) !== '/') {
			path += '/';
		}
		return '<img src="' + path + filename + '" alt="' + util.htmlEntities(emoji) + '">';;
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Editor (plain-text)
	 *
	 * @constructor
	 * @param {object} $textarea
	 * @param {object} options
	 */

	var EmojiArea_Plain = function($textarea, options) {
		this.options = options;
		this.$textarea = $textarea;
		this.$editor = $textarea;
		this.setup();
	};

	EmojiArea_Plain.prototype.insert = function(emoji) {
		if (!$.emojiarea.icons.hasOwnProperty(emoji)) return;
		util.insertAtCursor(emoji, this.$textarea[0]);
    console.log(emoji);
		this.$textarea.trigger('change');
	};

	EmojiArea_Plain.prototype.val = function() {
		return this.$textarea.val();
	};

	util.extend(EmojiArea_Plain.prototype, EmojiArea.prototype);

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Editor (rich)
	 *
	 * @constructor
	 * @param {object} $textarea
	 * @param {object} options
	 */

	var EmojiArea_WYSIWYG = function($textarea, options) {
		var self = this;
		console.log("wysiwyg init");

		this.options = options;
		this.$textarea = $textarea;
		this.$editor = $('<div>').addClass('emoji-wysiwyg-editor');
		this.$editor.text($textarea.val());
		this.$editor.attr({contenteditable: 'true'});
		this.$editor.on('blur keyup paste', function() { return self.onChange.apply(self, arguments); });
		this.$editor.on('mousedown focus', function() { document.execCommand('enableObjectResizing', false, false); });
		// this.$editor.on('blur', function() { document.execCommand('enableObjectResizing', true, true); });

		var html = this.$editor.text();
		var emojis = $.emojiarea.icons;
		for (var key in emojis) {
			if (emojis.hasOwnProperty(key)) {
				html = html.replace(new RegExp(util.escapeRegex(key), 'g'), EmojiArea.createIcon(key));
			}
		}
		this.$editor.html(html);
		console.log(this.$editor);

		$textarea.after(this.$editor);

		this.setup();

		$textarea.focus();

	};

	EmojiArea_WYSIWYG.prototype.onChange = function() {
		console.log("changed?2");
		this.$textarea.val(this.val()).trigger('change');
	};

	EmojiArea_WYSIWYG.prototype.insert = function(emoji) {
		console.log(emoji);
		var content;
		var $img = $(EmojiArea.createIcon(emoji));
		if ($img[0].attachEvent) {
			$img[0].attachEvent('onresizestart', function(e) { e.returnValue = false; }, false);
		}

		this.$editor.trigger('focus');
		if (this.selection) {
			util.restoreSelection(this.selection);
		}
		try { util.replaceSelection($img[0]); } catch (e) {}
		this.onChange();
		console.log("change");
	};

	EmojiArea_WYSIWYG.prototype.val = function() {
		var lines = [];
		var line  = [];

		var flush = function() {
			lines.push(line.join(''));
			line = [];
		};

		var sanitizeNode = function(node) {
			if (node.nodeType === TEXT_NODE) {
				line.push(node.nodeValue);
			} else if (node.nodeType === ELEMENT_NODE) {
				var tagName = node.tagName.toLowerCase();
				var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;

				if (isBlock && line.length) flush();

				if (tagName === 'img') {
					var alt = node.getAttribute('alt') || '';
					if (alt) line.push(alt);
					return;
				} else if (tagName === 'br') {
					flush();
				}

				var children = node.childNodes;
				for (var i = 0; i < children.length; i++) {
					sanitizeNode(children[i]);
				}

				if (isBlock && line.length) flush();
			}
		};

		var children = this.$editor[0].childNodes;
		for (var i = 0; i < children.length; i++) {
			sanitizeNode(children[i]);
		}

		if (line.length) flush();
		console.log("sanitize?");
		return lines.join('\n');
	};

	util.extend(EmojiArea_WYSIWYG.prototype, EmojiArea.prototype);


})(jQuery, window, document);
