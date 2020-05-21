// ==UserScript==
// @name        GlyphWiki: add context menus
// @version     8
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
// @inject-into content
// ==/UserScript==

function createIThumbMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'iThumbMenu-' + event.target.dataset.name;
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
	menuItem.icon = (document.querySelector('.glyphMain .iThumb50') ? document.querySelector('.glyphMain .iThumb50').src : false);
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

function addIThumbMenu() {
	let iThumbs = document.getElementsByClassName('iThumb');

	for (let i = 0; i < iThumbs.length; i++) {
		let menuId = 'iThumbMenu-' + iThumbs[i].dataset.name;

		if (iThumbs[i].dataset.name) {
			iThumbs[i].setAttribute('contextmenu', menuId);
			iThumbs[i].addEventListener('contextmenu', function(event) {
				if (!document.getElementById(menuId)) {
					createIThumbMenu(event);
				}
			});
		}
	}
}

function addBodyMenu() {
	document.body.setAttribute('contextmenu', 'bodyMenu');
	createBodyMenu();
}

addIThumbMenu();
if (document.body.dataset.ns == 'glyph') {
	addBodyMenu();
}
