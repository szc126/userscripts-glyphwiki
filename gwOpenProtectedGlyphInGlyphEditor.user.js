// ==UserScript==
// @name        GlyphWiki: open protected glyph in glyph editor
// @version     2
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==

if (gwData.protected) {
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
	inputs[2].value = gwData.related;

	inputs[3].type = "hidden";
	inputs[3].name = "edittime";
	/*inputs[3].value = Date.now();*/

	inputs[4].type = "submit";
	inputs[4].value = "新規グリフとして\n専用エディタで編集する";

	for (let i = 0; i < inputs.length; i++) {
		form.appendChild(inputs[i]);
	}

	let insertionTarget = document.querySelector(".edit.pThumb200");
	insertionTarget.appendChild(br);
	insertionTarget.appendChild(form);
}
