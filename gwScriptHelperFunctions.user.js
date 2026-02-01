// ==UserScript==
// @name        GlyphWiki script helper - functions
// @version     2026.02.01
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @grant       unsafeWindow
// @inject-into content
// ==/UserScript==

unsafeWindow.SH = {};

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
unsafeWindow.SH.updateClipboard = function(text) {
	navigator.clipboard.writeText(text).then(
		function() {
			//console.log();
		},
		function() {
			console.log('Could not write to clipboard! ' + text);
		}
	);
}

// Extract data from a page name
unsafeWindow.SH.analyzeName = function(name) {
	let data = {};
	name = name.match(/^(.+:)?(.+_)?(.*?)(@.+)?$/);

	data["ns"] = (name[1] && name[1].slice(0, -1) || "glyph");
	data["userGlyphUser"] = (name[2] && name[2].slice(0, -1));
	data["userGlyphName"] = name[3];
	data["revision"] = name[4];

	data["name"] = (name[2] || "") + name[3];

	return data;
}

unsafeWindow.SH.nameToUnicode = function(name) {
	return name
		.replace(/-?u([0-9a-f]{4,})/g, function(_, hex) {
			return String.fromCodePoint('0x' + hex);
		})
		.replace(/-?cdp-([0-9a-f]{4,})/g, '〓')
	;
}

unsafeWindow.SH.removeNameSuffix = function(name) {
	if (name.match(/^(cdp-|u[0-9a-f]{4,})/)) {
		return name.replace(/(-(var|itaiji)-\d{3}|-([a-z]{1,2}|)(\d{2}|))+$/g, '');
	}
	return name;
}