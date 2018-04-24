// ==UserScript==
// @name GlyphWiki: replace PNG with SVG
// @version 2
// @namespace szc
// @description boiii we svg now
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @run-at document-idle
// @grant GM_addStyle
// ==/UserScript==
    
if (true) {
  let pngs = document.querySelectorAll(".iThumbPng"); // querySelectorAll because it's not live and .length won't change...

  for (let i = 0; i < pngs.length; i++) {
    if (!pngs[i].classList.contains("iThumbError")) {
      pngs[i].src = pngs[i].src.replace(/\.\d+px\./, ".").replace(/\.png$/, ".svg");
      pngs[i].classList.replace("iThumbPng", "iThumbSvg");
    }
  }
}

GM_addStyle(`
  .iThumbSvg {
    background: white;
  }

  .iThumbSvg.iThumb50:hover {
    transform: scale(3);
  }

  .glyphMain.pThumb200.pThumbSvg + .glyphMain.pThumb200.pThumbPng {
    display: none; /* begone thot */
  }
`);
