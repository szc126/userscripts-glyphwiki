// ==UserScript==
// @name        GlyphWiki: replace PNG with SVG
// @version     2023.01.01
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

let pngs = document.querySelectorAll(".glyph, .thumb"); // querySelectorAll because it's not live and .length won't change...
for (let i = 0; i < pngs.length; i++) {
	pngs[i].src = pngs[i].src.replace(/\.\d+px\./, ".").replace(/\.png$/, ".svg");
}

let style = document.createElement('style');
style.innerHTML = `
	[src$=".svg"] {
		background: white;
	}

	[src$=".svg"][height="50"]:hover {
		transform: scale(3);
	}

	.glyphMain:nth-of-type(2) {
		display: none;
	}

	/* gwAddGlyphBoundingBoxes */

	[src$=".svg"][height="50"]:hover ~ .x-thumbBoundingBox {
		transform: scale(3);
	}
`;
document.head.appendChild(style);
