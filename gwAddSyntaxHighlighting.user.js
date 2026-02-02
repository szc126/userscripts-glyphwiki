// ==UserScript==
// @name        GlyphWiki: add syntax highlighting
// @author      ChatGPT, szc
// @namespace   szc
// @version     2026.02.02
// @description Replace text fields with a CodeMirror editor
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       GM_getResourceText
// @grant       unsafeWindow
// @inject-into content
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/mode/simple.min.js
// @resource    CM_CSS https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css
// ==/UserScript==

"use strict";

// https://cdnjs.com/libraries/codemirror
// https://codemirror.net/5/
// https://codemirror.net/5/demo/simplemode.html

if ((document.body.dataset.action == 'edit' || document.body.dataset.action == 'preview') && (document.body.dataset.ns != 'glyph')) {
	// Inject CodeMirror CSS
	const style = document.createElement("style");
	style.textContent = GM_getResourceText("CM_CSS");
	document.head.appendChild(style);

	// Append personal CSS
	style.textContent += `
		.CodeMirror {
			border: 1px solid ButtonBorder;
			height: 35em;
			font-size: 1.5em;
			line-height: calc(var(--multiplier) * 1em);
			--multiplier: 2;
		}
		.cm-underline {
			text-decoration: underline;
		}
		.cm-link-gw-thumb {
			margin-left: calc(var(--multiplier) * 2ch);
		}
		div.right_pane .cm-gw-thumb .thumb {
			width: calc(var(--multiplier) * 2ch);
			height: calc(var(--multiplier) * 2ch);
			left: calc(var(--multiplier) * -2ch);
			top: calc(var(--multiplier) * -1.1em);
			position: relative;
		}
	`;

	// Create mode
	CodeMirror.defineSimpleMode("glyphwiki", {
		start: [
			// https://glyphwiki.org/wiki/GlyphWiki:編集の仕方
			// 基本ルール
			{
				regex: /\\n/,
				token: "tag",
			},
			{
				regex: / .+/,
				sol: true,
				token: "meta",
			},
			// その他
			{
				regex: /__no_toc__/,
				token: "keyword",
			},
			// https://glyphwiki.org/wiki/GlyphWiki:フォント生成
			{
				regex: /__no_font__/,
				token: "keyword",
			},
			// 文字飾り
			{
				regex: /'''.+?'''/,
				token: "em",
			},
			{
				regex: /''.+?''/,
				token: "strong",
			},
			{
				regex: /==.+?==/,
				token: "strikethrough",
			},
			{
				regex: /__.+?__/,
				token: "underline",
			},
			// 見出し
			{
				regex: /\*\*\*/,
				sol: true,
				token: "header",
			},
			{
				regex: /\*\*/,
				sol: true,
				token: "header",
			},
			{
				regex: /\*/,
				sol: true,
				token: "header",
			},
			// 箇条書き、水平線、引用文
			{
				regex: /(----)(.*)/,
				sol: true,
				token: ["hr.strikethrough", "error"],
			},
			{
				regex: /---/,
				sol: true,
				token: "string",
			},
			{
				regex: /--/,
				sol: true,
				token: "string",
			},
			{
				regex: /-/,
				sol: true,
				token: "string",
			},
			{
				regex: />>>/,
				sol: true,
				token: "quote",
			},
			{
				regex: />>/,
				sol: true,
				token: "quote",
			},
			{
				regex: />/,
				sol: true,
				token: "quote",
			},
			// ハイパーリンク
			{
				regex: /https?:\/\/\S+/,
				token: "link",
			},
			{
				regex: /(\[\[)([^\]]+)( )([a-z0-9-@_]+)(\]\])/,
				token: ["link.link-gw-thumb", "qualifier", null, "link", "link"],
			},
			{
				regex: /(\[\[)([a-z0-9-@_]+)(\]\])/,
				token: ["link.link-gw-thumb", "link", "link"],
			},
			{
				regex: /(\[\[)([^\]]+)( )([^\]\s]+)(\]\])/,
				token: ["link", "qualifier", null, "link", "link"],
			},
			{
				regex: /(\[\[)([^\]\s]+)(\]\])/,
				token: ["link", "link", "link"],
			},
			// 用語解説
			{
				regex: /:/,
				sol: true,
				//next: "dl", // XXX: disables other highlighting
				token: "def",
			},
			// テーブル
			{
				regex: /,/,
				sol: true,
				//next: "table", // XXX: disables other highlighting
				token: "def",
			},
			// バーベイタム機能
			{
				regex: /---\(/,
				sol: true,
				token: "meta",
			},
			{
				regex: /---\)/,
				sol: true,
				token: "meta",
			},
			{
				regex: /--\(/,
				sol: true,
				token: "meta",
			},
			{
				regex: /--\)/,
				sol: true,
				token: "meta",
			},
			// 署名
			{
				regex: /~~~~~/,
				token: "keyword",
			},
			{
				regex: /~~~~/,
				token: "keyword",
			},
			{
				regex: /~~~/,
				token: "keyword",
			},
		],
		dl: [
			// 用語解説
			{
				regex: /(:)(.+)/,
				token: ["def", null],
			},
			{
				sol: true,
				next: "start",
			},
		],
		table: [
			// テーブル
			{
				regex: /,/,
				token: "def",
			},
			{
				sol: true,
				next: "start",
			},
		],
	});

	// Convert to CodeMirror
	const textarea = document.getElementById("edTextbox");
	const cm = CodeMirror.fromTextArea(textarea, {
		value: textarea.value,
		mode: "glyphwiki",
		lineNumbers: true,
		lineWrapping: true,
	});

	// Revert to textarea
	const form = textarea.closest("form");
	form.addEventListener("submit", () => {
		cm.toTextArea();

		// Remove "stay on page / leave page" prompt
		// https://stackoverflow.com/q/1119289
		unsafeWindow.onbeforeunload = null;
	});

	// Inline thumbnail decoration
	function decorateInlineThumbnails() {
		// Remove previous decorations
		document.body.querySelectorAll(".CodeMirror .cm-gw-thumb").forEach(el => el.remove());

		const doc = cm.getDoc();
		const text = doc.getValue();

		// Find all links
		// XXX: can this be updated to rely on tokens
		// XXX: can this be updated to draw only visible items as needed
		for (const match of text.matchAll(/(\[\[)([^\]]+ |)([a-z0-9-@_]+)(\]\])/g)) {
			const name = match[3];

			// Find position in document
			const from = doc.posFromIndex(match.index);

			// Create thumbnail element
			const span = document.createElement("span");
			span.className = "cm-gw-thumb";
			span.style.display = "inline-block";

			const img = document.createElement("img");
			img.src = `//glyphwiki.org/glyph/${name}.50px.png`;
			img.classList.add("thumb");
			img.dataset.name = name;
			img.loading = "lazy";

			const link = document.createElement("a");
			link.href = `//glyphwiki.org/wiki/${name}`;
			link.dataset.ns = "glyph";
			link.dataset.name = name;

			link.appendChild(img);
			span.appendChild(link);

			// Attach as a CodeMirror widget, inline after the link
			cm.addWidget(from, span, false);
		}
	}

	// Debounce updates
	let timer = null;
	cm.on("changes", () => {
		clearTimeout(timer);
		timer = setTimeout(decorateInlineThumbnails, 250);

		// Add "stay on page / leave page" prompt
		// https://stackoverflow.com/q/1119289
		unsafeWindow.onbeforeunload = function() {
			return true;
		};
	});

	if (document.body.dataset.action == 'preview') {
		// Add "stay on page / leave page" prompt
		// https://stackoverflow.com/q/1119289
		unsafeWindow.onbeforeunload = function() {
			return true;
		};
	}

	// Initial render
	decorateInlineThumbnails();
}