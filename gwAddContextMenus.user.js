// ==UserScript==
// @name GlyphWiki: add context menus
// @version 2
// @namespace szc
// @description piyo
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @run-at document-idle
// @grant none
// ==/UserScript==

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
function updateClipboard(text) {
	navigator.clipboard.writeText(text).then(
		function() {
			// clipboard successfully set
		},
		function() {
			// clipboard write failed
		}
	);
}

function removePageSuffix(page) {
	if (page.match(/^(cdp-|u[0-9a-f]{4,})/)) {
		return page.replace(/(-(var|itaiji)-\d{3}|-\d{2}|-[a-z]{1,}|-[a-z]{1,}\d{2})$/g, '');
	}
	return page;
}

function createIThumbMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'iThumbMenu-' + this.dataset.page;
	menu.type = 'context';

	let menuItem;

	menuItem = document.createElement('menuitem');
	menuItem.icon = this.src;
	menuItem.innerText = 'グリフ名をコピー' + (this.dataset.page ? '：' + this.dataset.page : '');
	menuItem.disabled = (!this.dataset.page);
	menuItem.onclick = function() {
		updateClipboard(page);
	};
	menu.appendChild(menuItem);

	let pageNoSuffix = removePageSuffix(this.dataset.page);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'グリフ名（接尾無し）をコピー' + (pageNoSuffix ? '：' + pageNoSuffix : '');
	menuItem.disabled = (!pageNoSuffix);
	menuItem.onclick = function() {
		updateClipboard(pageNoSuffix);
	};
	menu.appendChild(menuItem);

	menuItem = document.createElement('menuitem');
	menuItem.innerText = '関連字をコピー';
	menuItem.disabled = true;
	menuItem.onclick = function() {
		// XXX
	};
	menu.appendChild(menuItem);

	document.body.appendChild(menu);
}

function createBodyMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'bodyMenu';
	menu.type = 'context';

	let menuItem;

	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'グリフ名をコピー' + (document.body.dataset.page ? '：' + document.body.dataset.page : '');
	menuItem.disabled = (!document.body.dataset.page);
	menuItem.onclick = function() {
		updateClipboard(document.body.dataset.page);
	};
	menu.appendChild(menuItem);

	let pageNoSuffix = removePageSuffix(document.body.dataset.page);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'グリフ名（接尾無し）をコピー' + (pageNoSuffix ? '：' + pageNoSuffix : '');
	menuItem.disabled = (!pageNoSuffix);
	menuItem.onclick = function() {
		updateClipboard(pageNoSuffix);
	};
	menu.appendChild(menuItem);

	menuItem = document.createElement('menuitem');
	menuItem.innerText = '関連字をコピー' + (document.body.dataset.related ? '：' + document.body.dataset.related : '');
	menuItem.disabled = (!document.body.dataset.related);
	menuItem.onclick = function() {
		updateClipboard(document.body.dataset.related);
	};
	menu.appendChild(menuItem);

	document.body.appendChild(menu);
}

function addIThumbMenu() {
	let iThumbs = document.getElementsByClassName('iThumb');

	for (let i = 0; i < iThumbs.length; i++) {
		iThumbs[i].setAttribute('contextmenu', 'iThumbMenu-' + iThumbs[i].dataset.page);
		iThumbs[i].addEventListener('contextmenu', createIThumbMenu);
	}
}

function addBodyMenu() {
	document.body.setAttribute('contextmenu', 'bodyMenu');
	createBodyMenu();
}

addIThumbMenu();
if (document.body.dataset.ns == 'glyph') addBodyMenu();
