// ==UserScript==
// @name        GlyphWiki: add context menus
// @version     6
// @namespace   szc
// @description -
// @match       *://glyphwiki.org/wiki/*
// @match       *://*.glyphwiki.org/wiki/*
// @run-at      document-idle
// @grant       none
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

function removePageSuffix(name) {
	if (name.match(/^(cdp-|u[0-9a-f]{4,})/)) {
		return name.replace(/(-(var|itaiji)-\d{3}|-([a-z]{1,2}|)(\d{2}|))+$/g, '');
	}
	return name;
}

function createIThumbMenu(event) {
	let menu = document.createElement('menu');
	menu.id = 'iThumbMenu-' + event.target.dataset.name;
	menu.type = 'context';

	let menuItem;

	menuItem = document.createElement('menuitem');
	menuItem.icon = event.target.src;
	menuItem.innerText = 'グリフ名をコピー' + (event.target.dataset.name ? '：' + event.target.dataset.name : '');
	menuItem.disabled = (!event.target.dataset.name);
	menuItem.onclick = function() {
		updateClipboard(event.target.dataset.name);
	};
	menu.appendChild(menuItem);

	let nameNoSuffix = removePageSuffix(event.target.dataset.name);
	menuItem = document.createElement('menuitem');
	menuItem.innerText = 'グリフ名（接尾無し）をコピー' + (nameNoSuffix ? '：' + nameNoSuffix : '');
	menuItem.disabled = (!nameNoSuffix);
	menuItem.onclick = function() {
		updateClipboard(nameNoSuffix);
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
	menuItem.icon = document.querySelector('.glyphMain .iThumb50').src;
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
		let menuId = 'iThumbMenu-' + iThumbs[i].dataset.page;

		if (iThumbs[i].dataset.page) {
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
