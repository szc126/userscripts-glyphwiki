// ==UserScript==
// @name GlyphWiki: add glyph bounding boxes
// @version 1
// @namespace szc
// @description Add bounding boxes to 200px images, similar to the one in the Glyph Editor
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*/*
// @run-at document-idle
// @grant GM_addStyle
// ==/UserScript==

function addClasses() {
	let images = document.getElementsByClassName("iThumb200");

	for (let i = 0; i < images.length; i++) {
		let image = images.item(i);
		let wrapper = document.createElement('div');
		let boundingBox = document.createElement('div');

		wrapper.classList.add('x-glyph-200-wrapper');
		boundingBox.classList.add('x-glyph-200-bounding-box');

		wrapper.innerHTML = image.outerHTML + boundingBox.outerHTML;
		image.outerHTML = wrapper.outerHTML;
	}
}

function addStyles() {
	GM_addStyle(`
		.x-glyph-200-wrapper {
			position: relative;
			display: inline-block;
		}

		.x-glyph-200-bounding-box {
			position: absolute;
			top: 0;
			border: 1px dotted darkgrey;
			content: "";
			height: 176px;
			width: 176px;
			margin-top: calc(12px + 1em);
			margin-left: 12px;
		}

		.compare ~ .x-glyph-200-bounding-box {
			margin-top: calc(12px + 1em);
			margin-left: calc(12px + 1em);
		}
	`);
}

addClasses();
addStyles();
