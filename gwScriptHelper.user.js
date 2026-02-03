// ==UserScript==
// @namespace   szc
// @name        GlyphWiki: base script
// @version     2026.02.03
// @author      sz
// @description -
// @icon        https://glyphwiki.org/glyph/u5b57.50px.png
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-end
// @grant       unsafeWindow
// @inject-into content
// ==/UserScript==

// Install functions
unsafeWindow.SH = {};

unsafeWindow.SH.analyzeName = function(name) {
	let data = {};
	name = name.match(/^(?:(.+):)?(?:(.+)_)?(.+?)(?:@(\d+))?$/);

	data["ns"] = (name[1] ? name[1].toLowerCase() : "glyph");
	data["user"] = name[2];
	data["name"] = name[3];
	data["revision"] = name[4];

	return data;
}

// https://glyphwiki.org/wiki/Group:CDP外字-ALL
var UNI_PUA_START = '\ue000';
var UNI_PUA_END = '\uf8ff';
var EUDC_TO_PUA = 0xEE1B;
unsafeWindow.SH.hexToUnicode = function(hex) {
	if (hex.startsWith('cdp-')) {
		// https://kanji-database.sourceforge.net/ids/ids.html
		// XXX: `(YY>129)` seems to be a typo? is it? idk what's going on
		let xx = parseInt(hex.slice(4, 6), 16);
		let yy = parseInt(hex.slice(6, 8), 16);
		return String.fromCodePoint(
			((xx - 128) * 157) + ((yy<129)?(yy-64):(yy-98)) + EUDC_TO_PUA
		);
	}
	return String.fromCodePoint(hex.replace('u', '0x'));
}

unsafeWindow.SH.unicodeToHex = function(char) {
	if (char >= UNI_PUA_START && char <= UNI_PUA_END) {
		// https://glyphwiki.org/wiki/Group:CDP外字
		let a = char.codePointAt(0) - EUDC_TO_PUA;
		let xx = Math.floor(a / 157) + 128;
		let yy = (a % 157);
		yy += (yy < 62) ? 64 : 98;
		return 'cdp-' + xx.toString(16).padStart(2, 0) + yy.toString(16).padStart(2, 0);
	}
	return 'u' + char.codePointAt(0).toString(16).padStart(4, 0);
}

unsafeWindow.SH.nameToUnicode = function(name) {
	return name
		.replace(/-?(u[0-9a-f]{4,})/g, function(_, hex) {
			return unsafeWindow.SH.hexToUnicode(hex);
		})
		.replace(/-?(cdp-[0-9a-f]{4,})/g, function(_, hex) {
			return unsafeWindow.SH.hexToUnicode(hex);
		})
	;
}

unsafeWindow.SH.unicodeToName = function(name) {
	if (name.codePointAt(0) < 128) {
		// do not codepoint-ize ASCII names like `sandbox`
		return;
	}
	return name
		.replace(/(?<![@-].*)([^@-])/gu, function(_, char) {
			return '-' + unsafeWindow.SH.unicodeToHex(char);
		})
		.replace(/^-/, '')
	;
}

unsafeWindow.SH.removeNameSuffix = function(name) {
	if (name.match(/^(cdp-|u[0-9a-f]{4,})/)) {
		return name.replace(/(-(var|itaiji)-\d{3}|-([a-z]{1,2}|)(\d{2}|))+$/g, '');
	}
	return name;
}

// Modify the DOM
gwData = {};

let temp;

// #firstHeading, #siteSub
let h1 = document.getElementsByTagName("h1")[0];
let sub = h1.nextElementSibling;
h1.id = "firstHeading";
sub.id = "siteSub";

// Extract data from query string
temp = new URLSearchParams(window.location.search);
for (let pair of temp) {
	gwData[pair[0]] = pair[1];
}
// XXX: it seems like the Preview button never sends us to `?action=preview`
gwData["action"] = document.querySelector('.warning2.notice') ? "preview" : gwData["action"];
gwData["action"] ??= "view";

// Extract data from page elements
gwData["lang"] = document.documentElement.lang;

gwData = Object.assign(gwData, unsafeWindow.SH.analyzeName(decodeURIComponent(window.location.pathname.match(/[^/]+$/)[0])));

temp = [document.querySelector("span.related"), document.querySelector("input[name=related]")];
temp = [temp[0] && temp[0].innerText, temp[1] && temp[1].value];
gwData["related"] = temp[0] || temp[1];

gwData["protected"] = !!document.querySelector("#firstHeading ~ .message + hr");

// ns-specific
if (gwData.ns == "glyph") {
	if (gwData.action == "view") {
		// #aliasSub
		let aliasSub = sub.nextElementSibling.nextElementSibling; // #siteSub + br + *
		if (aliasSub && aliasSub.tagName == "DIV" && aliasSub.classList.contains("texts")) {
			aliasSub.id = "hAliasSub";
			temp = aliasSub.querySelector("a");
			gwData["aliasTarget"] = temp && temp.innerText;
		}

		temp = {};
		// #glyphCaption, #revision
		if (h1.children.length == 2) {
			temp.glyphCaption = h1.children[0];
			temp.revision = h1.children[1];
		} else if (h1.children.length == 1) {
			if (h1.children[0].innerText.startsWith('(@')) {
				// example: existing glyph, and the GW software does not provide a caption
				temp.revision = h1.children[0];
			} else {
				// example: uncreated glyph, and the GW software provides a caption
				temp.glyphCaption = h1.children[0];
			}
		}
		for (let k in temp) {
			temp[k].id = k; // add ID
			gwData[k] = temp[k].innerText.substring(1, temp[k].innerText.length - 1); // add to gwData
		}

		// Add IDs to h2s
		let h2All = document.getElementsByTagName("h2");

		for (let i = 0; i < h2All.length; i++) {
			let next = h2All[i].nextElementSibling.firstChild; // <h2> + div.texts > *:first-child

			switch (next.tagName) {
				case "UL":
					h2All[i].id = "hMojiCodeKanrenJoho";
					break;
				case "P":
					if (next.nextElementSibling == null) {
						h2All[i].id = "hAliasItiran";
					} else {
						h2All[i].id = "hMetaJoho";
					}
					break;
				case "TABLE":
					h2All[i].id = "hKanrenGlyph";
					break;
			}
		}

		// Add classes to images for this glyph
		let thisGlyphImagesA = document.querySelectorAll('#firstHeading ~ a[href^="/glyph/"]');

		for (let i = 0; i < thisGlyphImagesA.length; i++) {
			thisGlyphImagesA[i].classList.add("glyphMain");
		}
	}
}

// Write data to <body>
let gwDataDoNotWriteToDataAttribute = {
	lang: true,
}
for (let k in gwData) {
	let v = gwData[k];
	if (v == null) {
		continue;
	}
	if (gwDataDoNotWriteToDataAttribute[k]) {
		continue;
	}
	v = v.toString(); // for booleans
	document.body.dataset[k] = v;
}

// Print gwData to console for debugging
console.log(gwData);

// Add data attributes to thumbnails
let glyphImages = document.querySelectorAll(".glyph, .thumb, .thumb100");
for (let i = 0; i < glyphImages.length; i++) {
	temp = glyphImages[i].src.match(/\.(\d+)px\./);
	let pxSize = glyphImages[i].height || glyphImages[i].width || (temp && temp[1]) || 200;

	glyphImages[i].height = pxSize;
	glyphImages[i].width = pxSize;

	let name = glyphImages[i].src.match(/glyph\/([^@.]+)/);
	let revision = glyphImages[i].src.match(/\@(\d+)/);
	glyphImages[i].dataset["name"] = (name && name[1]);
	glyphImages[i].dataset["revision"] = (revision && revision[1]);
}

// Add data attributes to links
let links = document.querySelectorAll('.right_body a[href*="/wiki/"]:not([data-name]):not([href*="?"])');
for (let i = 0; i < links.length; i++) {
	let data = unsafeWindow.SH.analyzeName(links[i].href.match(/wiki\/([^@.]+)/)[1]);
	for (let k in data) {
		let v = data[k];
		if (v == null) {
			continue;
		}
		v = v.toString(); // for booleans
		links[i].dataset[k] = v;
	}
}

// Add IDs to tabs
temp = {
	caEdit: document.querySelector('.tab a[href$="edit"]'),
	caHistory: document.querySelector('.tab a[href$="history"]'),
	caTalk: document.querySelector('.tab a[href^="/wiki/Talk:"]'),
	caMain: document.querySelector('.tab:nth-of-type(1) a'),
}
for (let k in temp) {
	if (temp[k] == null) {
		continue;
	}
	temp[k].id = k;
}

// Add IDs to elements on the edit page
if (gwData.action == "edit" || gwData.action == "preview") {
	temp = {
		edGlyphEditor: document.querySelector(".edit button[onclick]"),
		edRelated: document.querySelector("input[type=text][name=related]"),
		edTextbox: document.querySelector("textarea[name=textbox]"),
		edTextboxMetaJoho: document.querySelector("textarea[name=textbox2]"), /* existing ID: #metatext */
		edSummary: document.querySelector(".toolbox input[name=summary]"),
		edPreview: document.querySelector(".toolbox input[type=submit]:nth-of-type(2)"),
		edSubmit: document.querySelector(".toolbox input[type=submit]:nth-of-type(3)"),
	}

	for (let k in temp) {
		if (temp[k] == null) {
			continue;
		}
		temp[k].id = k;
	}
}