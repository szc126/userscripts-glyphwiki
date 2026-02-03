// ==UserScript==
// @namespace   szc
// @name        GlyphWiki: open protected glyphs in the glyph editor
// @version     2026.02.03
// @author      sz
// @description -
// @icon        https://glyphwiki.org/glyph/u6790.50px.png
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

let i18nStrings = {};

i18nStrings["ja"] = {
	"Edit as new glyph using the glyph editor": "新規グリフとして\n専用エディタで編集する",
}

i18nStrings["en"] = {
	"Edit as new glyph using the glyph editor": "Edit as new glyph\nusing the glyph editor",
}

i18nStrings["ko"] = {
	"Edit as new glyph using the glyph editor": "Edit as new glyph\nusing the glyph editor",
}

i18nStrings["zhs"] = {
	"Edit as new glyph using the glyph editor": "Edit as new glyph\nusing the glyph editor",
}

i18nStrings["zht"] = {
	"Edit as new glyph using the glyph editor": "Edit as new glyph\nusing the glyph editor",
}

// ----

if (document.body.dataset.protected) {
	let br = document.createElement("br");
	let form = document.createElement("form");
	let inputs = [];

	form.id = "edGlyphEditor";
	form.className = "centering";
	form.method = "post";
	form.action = "/glyphEditor.cgi";

	for (let i = 0; i < 5; i++) {
		inputs[i] = document.createElement("input"); // inputs.fill(document.createElement("input")) seems to be bad
	}

	inputs[0].type = "hidden";
	inputs[0].name = "name";
	inputs[0].value = "sandbox";

	inputs[1].type = "hidden";
	inputs[1].name = "data";
	inputs[1].value = document.getElementById("edTextbox").value;

	inputs[2].type = "hidden";
	inputs[2].name = "related";
	inputs[2].value = document.body.dataset.related;

	inputs[3].type = "hidden";
	inputs[3].name = "edittime";
	/*inputs[3].value = Date.now();*/

	inputs[4].type = "submit";
	inputs[4].value = i18nStrings[document.documentElement.lang]["Edit as new glyph using the glyph editor"];

	for (let i = 0; i < inputs.length; i++) {
		form.appendChild(inputs[i]);
	}

	let insertionTarget = document.querySelector(".edit.pThumb200");
	insertionTarget.appendChild(br);
	insertionTarget.appendChild(form);
}
