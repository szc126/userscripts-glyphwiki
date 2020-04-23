// ==UserScript==
// @name GlyphWiki: tab index and access key
// @version 2
// @namespace szc
// @description yee
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @run-at document-idle
// @grant none
// ==/UserScript==

// XXX: mutationObserver

if (gwData.action == "edit" || gwData.action == "preview") {
	let eds = document.getElementsByClassName("ed");
	let order = {
		edGlyphEditor: 101,
		edRelated: 103,
		edTextbox: 102, // textbox > related
		edSummary: 104,
		edPreview: 106,
		edSubmit: 105, // submit > preview
	}

	for (let i = 0; i < eds.length; i++) {
		let edName = eds[i].id;
		eds[i].tabIndex = order[edName];
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
