// ==UserScript==
// @name GlyphWiki: tabIndex
// @version 1
// @namespace szc
// @description yee
// @match *://glyphwiki.org/wiki/*
// @match *://*.glyphwiki.org/wiki/*
// @run-at document-idle
// @grant none
// ==/UserScript==

if (gwData.action == "edit" || gwData.action == "preview") {
  let eds = document.getElementsByClassName("ed");
  let order = {
    edGlyphEditor: 101,
    edRelated: 103,
    edTextbox: 102, // textbox > related
    edSummary: 104,
    edPreview: 106,
    edSubmit: 105, // submit > preview
  }

  for (let i = 0; i < eds.length; i++) {
    let edName = eds[i].id;
    eds[i].tabIndex = order[edName];
  }
}