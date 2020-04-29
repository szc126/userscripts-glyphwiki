// ==UserScript==
// @name GlyphWiki script helper
// @version 7
// @namespace szc
// @description piyo
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @grant none
// ==/UserScript==

gwData = {};

let temp;

// Capitalize first letter of a string
// (https://stackoverflow.com/a/1026087)
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Extract data from a page name
function analyzePage(page) {
	let data = {};
	temp = page.split(":");

	data["ns"] = (temp[1] ? temp[0].toLowerCase() : "glyph");

	return data;
}

// Extract data from the page name of a user glyph
function analyzeUserGlyph(page) {
	let data = {};
	temp = page.split("_");

	if (temp[1]) {
		data["isUserGlyph"] = true;
		data["userGlyphUser"] = temp[0].toLowerCase();
		data["userGlyphPage"] = temp[1].toLowerCase();
	} else {
		data["isUserGlyph"] = false;
	}

	return data;
}

// #firstHeading, #siteSub
let h1 = document.getElementsByTagName("h1")[0];
let sub = h1.nextElementSibling;
h1.id = "firstHeading";
sub.id = "siteSub";

// Extract data from query string
let queryStringRe = /[?&]([^=]+)=([^?&]+)/g;
while (1) {
	temp = queryStringRe.exec(window.location.search);
	if (temp != null) {
		gwData[temp[1]] = temp[2];
	} else {
		break;
	}
}
if (gwData.action == null) {
	gwData.action = "view";
}

// Extract data from page elements
gwData["lang"] = document.documentElement.lang;

gwData["page"] = window.location.pathname.match(/\/([^/]+)$/)[1];

temp = analyzePage(gwData.page);
gwData["ns"] = temp.ns;

temp = analyzeUserGlyph(gwData.page);
gwData["isUserGlyph"] = (temp.isUserGlyph ? "1" : null);
gwData["userGlyphUser"] = temp.userGlyphUser;
gwData["userGlyphPage"] = temp.userGlyphPage;

temp = document.querySelector("span.related");
if (temp) {
	gwData["related"] = temp.innerText;
} else {
	temp = document.querySelector("input[name=related]");

	if (temp) {
		gwData["related"] = temp.value;
	}
}

temp = document.querySelector("#firstHeading ~ .message + hr");
gwData["protected"] = (temp ? "1" : null);

// ns-specific
if (gwData.ns == "glyph") {
	if (gwData.action == "view") {
		// #aliasSub
		let aliasSub = sub.nextElementSibling.nextElementSibling; // #siteSub + br + *
		if (aliasSub.tagName == "DIV" && aliasSub.classList.contains("texts")) aliasSub.id = "aliasSub";

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
			//console.log(h2All[i], next, next.tagName);

			switch (next.tagName) {
				case "UL":
					h2All[i].id = "MojiCodeKanrenJoho";
					break;
				case "P":
					if (next.nextElementSibling == null) {
						h2All[i].id = "AliasItiran";
					} else {
						h2All[i].id = "MetaJoho";
					}
					break;
				case "TABLE":
					h2All[i].id = "KanrenGlyph";
					break;
					// ...
			}
			//console.log(h2All[i].id);
		}

		// Add classes to images for this glyph
		let thisGlyphImagesA = document.querySelectorAll("#firstHeading ~ a[href*=glyph]");

		for (let i = 0; i < thisGlyphImagesA.length; i++) {
			thisGlyphImagesA[i].classList.add("glyphMain");
		}
	}
}

// Write data to <body>
let gwDataDoNotWriteToClass = {
	lang: true,
	glyphCaption: true,
}
let gwDataDoNotWriteToDataAttribute = {
	lang: true,
}
for (let k in gwData) {
	let v = gwData[k];
	if (v != null && !gwDataDoNotWriteToClass[k]) {
		document.body.classList.add(k + "-" + v.replace(/[:]/g, "_"));
	}
	if (v != null && !gwDataDoNotWriteToDataAttribute[k]) {
		document.body.dataset[k] = v;
	}
}

// print gwData to console for debugging
console.log(gwData);

// Add classes to thumbnails (.?Thumb100, .?ThumbPng, etc.)
// Also add data attributes
let glyphImages;

glyphImages = document.querySelectorAll(".glyph, .thumb");
for (let i = 0; i < glyphImages.length; i++) {
	let pxSize = glyphImages[i].src.match(/\.(\d+)px\./);
	let fileFormat = glyphImages[i].src.match(/\.(\w+)$/);
	pxSize = (pxSize ? pxSize[1] : "200");
	if (glyphImages[i].src.indexOf("error.png") > -1) pxSize = "Error";
	fileFormat = (fileFormat ? fileFormat[1] : "png");

	glyphImages[i].classList.add("iThumb");
	glyphImages[i].classList.add("iThumb" + pxSize);
	glyphImages[i].classList.add("iThumb" + capitalizeFirstLetter(fileFormat));

	glyphImages[i].parentNode.classList.add("pThumb");
	glyphImages[i].parentNode.classList.add("pThumb" + pxSize);
	glyphImages[i].parentNode.classList.add("pThumb" + capitalizeFirstLetter(fileFormat));

	let page = glyphImages[i].src.match(/glyph\/([^@.]+)/);
	if (page != null) {
		glyphImages[i].dataset["page"] = page[1];
		glyphImages[i].parentNode.dataset["page"] = page[1];
	}
}

glyphImages = document.querySelectorAll(".thumb100");
for (let i = 0; i < glyphImages.length; i++) {
	let pxSize = 100;

	glyphImages[i].classList.add("iThumb");
	glyphImages[i].classList.add("iThumb" + pxSize);
	//glyphImages[i].classList.add("iThumbPng");

	glyphImages[i].parentNode.classList.add("pThumb");
	glyphImages[i].parentNode.classList.add("pThumb" + pxSize);
	//glyphImages[i].parentNode.classList.add("pThumb" + capitalizeFirstLetter(fileFormat));

	let page = glyphImages[i].src.match(/glyph\/([^@.]+)/);
	if (page != null) {
		glyphImages[i].dataset["page"] = page[1];
		glyphImages[i].parentNode.dataset["page"] = page[1];
	}
}

// IDs for tabs
let tabAs = document.querySelectorAll(".tab a");
temp = {
	'action=edit': 'caEdit',
	'action=history': 'caHistory',
	'Talk:': 'caTalk',
	//'': 'caMain',
}

for (let i = 0; i < tabAs.length; i++) {
	tabAs[i].id = temp[
		(
			tabAs[i].href.match(new RegExp(Object.keys(temp).join('|'))) || ['caMain']
		)[0]
	];
}

// IDs for elements on the edit page
if (gwData.action == "edit" || gwData.action == "preview") {
	temp = {
		glyphEditorForm: document.querySelector("form[action=\"/glyphEditor.cgi\"]"),
		glyphEditor: document.querySelector("form[action=\"/glyphEditor.cgi\"] input[type=submit]"),
		related: document.querySelector("a + input[name=related]"),
		textbox: document.querySelector("textarea[name=textbox]"),
		summary: document.querySelector("input[name=summary]"),
		preview: document.querySelector(".toolbox input[name=buttons]:not(.notice)"),
		submit: document.querySelector(".toolbox input[name=buttons].notice"),
	}

	for (let k in temp) {
		// console.log(k, temp[k]);
		if (temp[k] != null) {
			temp[k].classList.add("ed");
			temp[k].id = "ed" + capitalizeFirstLetter(k); // why not
		}
	}
}
