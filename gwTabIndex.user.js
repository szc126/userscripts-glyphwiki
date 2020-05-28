// ==UserScript==
// @name        GlyphWiki: add tab indexes and access keys
// @version     6
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

if (document.body.dataset.action == 'edit' || document.body.dataset.action == 'preview') {
	let tabIndex = {
		edGlyphEditor: 101,
		edRelated: 102,
		edTextbox: 103,
		edTextboxMeta: 104,
		edSummary: 105,
		edPreview: 106,
		edSubmit: 107,
	}

	for (let id in tabIndex) {
		let el = document.getElementById(id);
		if (el) {
			el.tabIndex = tabIndex[id];
		}
	}
}

let accessKeys = {
	caMain: 'c',
	caTalk: 't',
	caEdit: 'e',
	caHistory: 'h',

	edGlyphEditor: 'a', // not related to MediaWiki
	edPreview: 'p',
	edSubmit: 's',
}

for (let id in accessKeys) {
	let el = document.getElementById(id);
	if (el) {
		el.accessKey = accessKeys[id];
	}
}
