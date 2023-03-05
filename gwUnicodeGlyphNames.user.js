// ==UserScript==
// @name        GlyphWiki: convert Unicode codepoints to Unicode in glyph names
// @version     2023.01.01
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

let as = document.querySelectorAll('a[data-name^="u"], a[data-user-glyph-name^="u"], a[data-name*="-u"]');
for (let i = 0; i < as.length; i++) {
	for (let j = 0; j < as[i].childNodes.length; j++) {
		let textOrig = as[i].childNodes[j].textContent;
		let textUni = textOrig;

		textUni = unsafeWindow.SH.nameToUnicode(textUni);

		if (textOrig != textUni) {
			let ruby = document.createElement('ruby');
			let rt = document.createElement('rt');

			ruby.classList.add('uniRuby');
			ruby.innerText = textOrig;

			rt.innerText = textUni;

			ruby.appendChild(rt);

			as[i].childNodes[j].replaceWith(ruby);
		}
	}
}

let style = document.createElement('style');
style.innerHTML = `
	ruby.uniRuby rt {
		font-size: inherit;
		color: black;
		opacity: 0.75;
		ruby-align: center;
	}
`;
document.head.appendChild(style);
