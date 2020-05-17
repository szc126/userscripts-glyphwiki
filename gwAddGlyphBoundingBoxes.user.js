// ==UserScript==
// @name        GlyphWiki: add glyph bounding boxes
// @version     6
// @namespace   szc
// @description Add bounding boxes to images, similar to the one in the Glyph Editor
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==

let images = document.querySelectorAll('.iThumb50, .iThumb100, .iThumb200');
for (let i = 0; i < images.length; i++) {
	let image = images.item(i);
	let wrapper = document.createElement('div');
	let boundingBox = document.createElement('div');

	wrapper.classList.add('x-thumbWrapper');
	boundingBox.classList.add('x-thumbBoundingBox');

	wrapper.innerHTML = image.outerHTML + boundingBox.outerHTML;
	image.outerHTML = wrapper.outerHTML;
}

let style = document.createElement('style');
style.innerHTML = `
	.x-thumbWrapper {
		position: relative;
		display: inline-block;
	}

	.x-thumbBoundingBox{
		--margin: calc((12/200) * var(--target));
		position: absolute;
		top: 0;
		border: 1px dotted crimson;
		content: "";
		height: calc(var(--target) - (var(--margin)) * 2);
		width: calc(var(--target) - (var(--margin)) * 2);
		margin: calc((var(--margin)));
		pointer-events: none;
	}

	.iThumb200 ~ .x-thumbBoundingBox {
		--target: 200px;
	}

	.iThumb100 ~ .x-thumbBoundingBox {
		--target: 100px;
	}

	.iThumb50 ~ .x-thumbBoundingBox {
		--target: 50px;
	}

	/* グリフの当ページ、最初にリストアップされる奴ら */

	div.right_pane img.glyph ~ .x-thumbBoundingBox {
		margin:
			calc((var(--margin)) + 1em)
			calc((var(--margin)) + 0em)
		;
	}

	div.right_pane img.page ~ .x-thumbBoundingBox {
		margin:
			calc((var(--margin)) + 0em)
			calc((var(--margin)) + 0.5em)
		;
	}

	/* 100 */

	div.right_pane .thumb ~ .x-thumbBoundingBox,
	div.right_pane .thumb100 ~ .x-thumbBoundingBox {
		margin:
			calc((var(--margin)) + 2px)
		;
	}

	/* 「引用する旧部品の更新」（グリフのページの下に出現する奴） */

	div.right_pane img.compare ~ .x-thumbBoundingBox {
		font-size: 90%;
		margin:
			calc((var(--margin)) + 1em)
			calc((var(--margin)) + 1em)
			calc((var(--margin)) + 0.5em)
			calc((var(--margin)) + 1em)
		;
	}
`;
document.head.appendChild(style);
