// ==UserScript==
// @name        GlyphWiki script helper - functions
// @version     1
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @grant       none
// @inject-into content
// ==/UserScript==

unsafeWindow.SH = {};

// Capitalize first letter of a string
// (https://stackoverflow.com/a/1026087)
unsafeWindow.SH.capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

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
unsafeWindow.SH.analyzePage = function(name) {
	let data = {};
	temp = name.split(":");

	data["ns"] = (temp[1] ? temp[0].toLowerCase() : "glyph");

	return data;
}

// Extract data from the page name of a user glyph
unsafeWindow.SH.analyzeUserGlyph = function(name) {
	let data = {};
	temp = name.split("_");

	if (temp[1]) {
		data["isUserGlyph"] = true;
		data["userGlyphUser"] = temp[0].toLowerCase();
		data["userGlyphPage"] = temp[1].toLowerCase();
	} else {
		data["isUserGlyph"] = false;
	}

	return data;
}

unsafeWindow.SH.nameToUnicode = function(name) {
	return name
		.replace(/-?u([0-9a-f]{4,})/g, function(_, m1) {
			return String.fromCodePoint('0x' + m1);
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