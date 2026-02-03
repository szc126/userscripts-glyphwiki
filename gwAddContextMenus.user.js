// ==UserScript==
// @namespace   szc
// @name        GlyphWiki: add context menus
// @version     2026.02.03
// @author      sz
// @description -
// @icon        https://glyphwiki.org/glyph/do-not-use.50px.png
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

// https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/85

function createThumbMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'thumbMenu-' + event.target.dataset.name;
	menu.type = 'context';

	let text;
	let menuItem;

	text = event.target.dataset.name;
	menuItem = document.createElement('menuitem');
	menuItem.icon = event.target.src;
	menuItem.innerText = 'グリフ名をコピー' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.nameToUnicode(event.target.dataset.name);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'Unicode 化' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.removeNameSuffix(event.target.dataset.name);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = '接尾無し' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.removeNameSuffix(event.target.dataset.name);
	text = unsafeWindow.SH.nameToUnicode(text);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'Unicode 化' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	document.body.appendChild(menu);
}

function createBodyMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'bodyMenu';
	menu.type = 'context';

	let menuItem;

	text = document.body.dataset.name;
	menuItem = document.createElement('menuitem');
	menuItem.icon = (document.querySelector('.glyphMain [height="50"]') ? document.querySelector('.glyphMain [height="50"]').src : false);
	menuItem.innerText = 'グリフ名をコピー' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.nameToUnicode(document.body.dataset.name);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'Unicode 化' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.removeNameSuffix(document.body.dataset.name);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = '接尾無し' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = unsafeWindow.SH.removeNameSuffix(document.body.dataset.name);
	text = unsafeWindow.SH.nameToUnicode(text);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'Unicode 化' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	text = document.body.dataset.related;
	menuItem = document.createElement('menuitem');
	menuItem.innerText = '関連字' + (text ? '：' + text : '');
	menuItem.disabled = (!text);
	menuItem.dataset.text = text;
	menuItem.onclick = function(event) {
		unsafeWindow.SH.updateClipboard(this.dataset.text);
	};
	menu.appendChild(menuItem);

	document.body.appendChild(menu);
}

function addThumbMenu() {
	let thumbs = document.getElementsByClassName('thumb');

	for (let i = 0; i < thumbs.length; i++) {
		let menuId = 'thumbMenu-' + thumbs[i].dataset.name;

		if (thumbs[i].dataset.name) {
			thumbs[i].setAttribute('contextmenu', menuId);
			thumbs[i].addEventListener('contextmenu', function(event) {
				if (!document.getElementById(menuId)) {
					createThumbMenu(event);
				}
			});
		}
	}
}

function addBodyMenu() {
	document.body.setAttribute('contextmenu', 'bodyMenu');
	createBodyMenu();
}

addThumbMenu();
if (document.body.dataset.ns == 'glyph') {
	addBodyMenu();
}
