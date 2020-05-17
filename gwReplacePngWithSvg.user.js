// ==UserScript==
// @name        GlyphWiki: replace PNG with SVG
// @version     5
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==

let pngs = document.querySelectorAll(".iThumbPng:not(.iThumbError)"); // querySelectorAll because it's not live and .length won't change...
for (let i = 0; i < pngs.length; i++) {
	pngs[i].src = pngs[i].src.replace(/\.\d+px\./, ".").replace(/\.png$/, ".svg");
	pngs[i].classList.replace("iThumbPng", "iThumbSvg");
}

let style = document.createElement('style');
style.innerHTML = `
	.iThumbSvg {
		background: white;
	}

	.iThumbSvg.iThumb50:hover {
		transform: scale(3);
	}

	.glyphMain.pThumb200.pThumbSvg + .glyphMain.pThumb200.pThumbPng {
		display: none;
	}
`;
document.head.appendChild(style);
