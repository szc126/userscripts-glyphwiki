// ==UserScript==
// @namespace   szc
// @name        GlyphWiki: add syntax highlighting
// @version     2026.02.03
// @author      ChatGPT, sz
// @description Replace text fields with a CodeMirror editor
// @icon        https://glyphwiki.org/glyph/u660e.50px.png
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       GM_getResourceText
// @grant       unsafeWindow
// @inject-into content
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/codemirror.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/mode/simple.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/search/searchcursor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/search/search.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/scroll/annotatescrollbar.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/search/matchesonscrollbar.min.js
// @resource    css_codemirror https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/codemirror.min.css
// @resource    css_matchesonscrollbar https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.20/addon/search/matchesonscrollbar.min.css
// ==/UserScript==

"use strict";

// https://cdnjs.com/libraries/codemirror
// https://codemirror.net/5/
// https://codemirror.net/5/demo/simplemode.html

if ((document.body.dataset.action == 'edit' || document.body.dataset.action == 'preview') && (document.body.dataset.ns != 'glyph')) {
	// Inject CSS
	const style = document.createElement("style");
	style.textContent = GM_getResourceText("css_codemirror");
	style.textContent += GM_getResourceText("css_matchesonscrollbar");
	style.textContent += `
		.CodeMirror {
			border: 1px solid ButtonBorder;
			height: 35em;
			font-size: 1.5em;
			line-height: calc(var(--multiplier) * 1.2em);
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
			top: calc(var(--multiplier) * -1.2em);
			position: relative;
		}
	`;
	document.head.appendChild(style);

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
	function decorateLines(from, to) {
		//console.log('received!', from, to);

		// Scan lines for glyphs
		const doc = cm.getDoc();
		let collection = [];
		for (let line_i = from; line_i <= to; line_i++) {
			// Remove previous decorations for this line
			// XXX: this does leave stale ones behind, if viewport change is dramatic. should we care
			document.body.querySelectorAll(`.cm-gw-thumb[data-line="${line_i}"]`).forEach(el => el.remove());

			const tokens = cm.getLineTokens(line_i);

			collection[line_i] = {};
			collection[line_i].starts = [];
			collection[line_i].strings = [];
			let searching = false;
			for (let token_i = 0; token_i < tokens.length; token_i++) {
				if (tokens[token_i].type == "link link-gw-thumb") {
					collection[line_i].starts.push(tokens[token_i].start);
					searching = true;
				}
				if (searching && tokens[token_i].type == "link") {
					collection[line_i].strings.push(tokens[token_i].string);
					searching = false;
				}
			}
		}

		// Create thumbnails
		for (const key in collection) {
			const line_i = parseInt(key);
			for (let glyph_i = 0; glyph_i < collection[line_i].starts.length; glyph_i++) {
				const from = collection[line_i].starts[glyph_i];
				const name = collection[line_i].strings[glyph_i];
				//console.log(line_i, from, name);

				// Create thumbnail element
				const span = document.createElement("span");
				span.className = "cm-gw-thumb";
				span.style.display = "inline-block";
				span.dataset.line = line_i;

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

				// Attach as a CodeMirror widget, below and before the link
				cm.addWidget({line: line_i, ch: from}, span);
			}
		}
	}

	if (document.body.dataset.action == 'preview') {
		// Add "stay on page / leave page" prompt
		// https://stackoverflow.com/q/1119289
		unsafeWindow.onbeforeunload = () => {
			return true;
		};
	}

	// Decorate initially visible lines
	const initialViewport = cm.getViewport();
	decorateLines(initialViewport.from, initialViewport.to);

	// Redecorate changed lines
	cm.on("changes", (cm, changes) => {
		const from = changes[0].from.line;
		const to = changes[0].to.line;
		decorateLines(from, to);

		// Add "stay on page / leave page" prompt
		// https://stackoverflow.com/q/1119289
		unsafeWindow.onbeforeunload = () => {
			return true;
		};
	});
	// Decorate newly visible lines
	cm.on("viewportChange", (cm, from, to) => {
		decorateLines(from, to);
	});
}