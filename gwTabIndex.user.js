// ==UserScript==
// @name GlyphWiki: tab index and access key
// @version 4
// @namespace szc
// @description -
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @run-at document-idle
// @grant none
// ==/UserScript==

// XXX: mutationObserver

if (gwData.action == 'edit' || gwData.action == 'preview') {
	let tabIndex = {
		edGlyphEditor: 101,
		edRelated: 102,
		edTextbox: 103,
		edSummary: 104,
		edPreview: 105,
		edSubmit: 106,
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
