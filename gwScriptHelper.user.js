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