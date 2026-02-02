// ==UserScript==
// @name        GlyphWiki: add syntax highlighting
// @author      ChatGPT
// @namespace   szc
// @version     0
// @description Replace text fields with a CodeMirror editor
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       GM_getResourceText
// @grant       unsafeWindow
// @inject-into content
// @require     https://unpkg.com/codemirror@5.65.13/lib/codemirror.js
// @require     https://unpkg.com/codemirror@5.65.13/mode/meta.js
// @resource    CM_CSS https://unpkg.com/codemirror@5.65.13/lib/codemirror.css
// ==/UserScript==

(function() {
	"use strict";

	const textarea = document.getElementById("edTextbox");
	if (!textarea) return;

	// ---- Inject CodeMirror CSS (CSP-safe) ----
	const style = document.createElement("style");
	style.textContent = GM_getResourceText("CM_CSS");
	document.head.appendChild(style);

	if (typeof CodeMirror === "undefined") {
		console.error("CodeMirror not available — check that @require is enabled.");
		return;
	}

	// ---- Create wrapper ----
	const wrapper = document.createElement("div");
	wrapper.style.border = "1px solid #ccc";
	wrapper.style.marginBottom = "0.5em";

	textarea.parentNode.insertBefore(wrapper, textarea);
	textarea.style.display = "none";

	// ---- Initialize CodeMirror ----
	const cm = CodeMirror(wrapper, {
		value: textarea.value,
		mode: "text/plain",
		lineNumbers: true,
		lineWrapping: true,
		indentUnit: 2,
		tabSize: 2,
		viewportMargin: Infinity
	});

	// Sync back before submit
	const form = textarea.closest("form");
	if (form) {
		form.addEventListener("submit", () => {
			textarea.value = cm.getValue();
		});
	}

	// ---- Inline thumbnail decoration ----
	function decorateInlineThumbnails() {
		// Remove previous decorations
		wrapper.querySelectorAll(".gw-inline-thumb").forEach(el => el.remove());

		const doc = cm.getDoc();
		const text = doc.getValue();

		// Find all [[links]]
		for (const match of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
			const title = match[1].trim();

			// Find position in document
			const from = doc.posFromIndex(match.index + match[0].length);

			// Create thumbnail element
			const span = document.createElement("span");
			span.className = "gw-inline-thumb";
			span.style.display = "inline-block";
			span.style.marginLeft = "4px";
			span.style.verticalAlign = "middle";

			const img = document.createElement("img");
			img.src = `https://glyphwiki.org/glyph/${encodeURIComponent(title)}.png`;
			img.alt = title;
			img.title = title;

			img.style.width = "28px";
			img.style.height = "28px";
			img.style.objectFit = "contain";
			img.style.border = "1px solid #ddd";
			img.style.background = "#fff";

			const link = document.createElement("a");
			link.href = `https://glyphwiki.org/wiki/${encodeURIComponent(title)}`;
			link.appendChild(img);
			span.appendChild(link);

			// Attach as a CodeMirror widget *inline after the link*
			cm.addWidget(from, span, false);
		}
	}

	// Debounce updates
	let timer = null;
	cm.on("changes", () => {
		clearTimeout(timer);
		timer = setTimeout(decorateInlineThumbnails, 250);
	});

	// Initial render
	decorateInlineThumbnails();
})();