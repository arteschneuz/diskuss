function getHeadline() {
  return $("#artikelEinleitung > h2").contents()[2].textContent.trim();
}

function getMetaHeadline() {
  return "TODO further release, not yet supported";
}

function getIntroduction() {
  return "TODO further release, not yet supported";
}

function getAuthors() {
  return "TODO further release, not yet supported";
}

function getArticleDate() {
  return "TODO further release, not yet supported";
}

function getArticleDatePattern() {
  return "TODO further release, not yet supported";
}

function getTopLinkElement() { 
  return $("#artikelEinleitung");
}

function getBottomLinkElement() {
  return appendOuterHTML($("#FAZContent > div > div > div.ArtikelAbbinder"), "bottom");
}

function getHeadlineElement(displayHeaderIconButton) {
  var headerElement = $("#FAZContent > div > h2");
 
  if(displayHeaderIconButton) {
    return replaceHackElement(headerElement, "</span>", "header");
  }
  else {
    return addHackElement(headerElement, false, "header");
  }
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(displayButton) {
    headerIcon.css("top", "-1px");
  }
  else {
    headerIcon.css("top", "-10px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.css("top", "10px");
  topLinkHref.addClass("redLink");
  topLinkHref.css("font-size", "1.1rem");
  topLinkCommentsCounter.css("font-size", "1rem");
  topLinkCommentsCounter.css("top", "1px");

  if(displayLinkIconButton) {
    topLinkHref.css("left", "4px");
  }
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  if(displayLinkIconButton) {
    bottomLinkHref.css("left", "4px");
  }

  bottomLinkBox.css("top", "6px");
  bottomLinkHref.addClass("redLink");
  bottomLinkHref.css("font-size", "1.1rem");
  bottomLinkCommentsCounter.css("font-size", "1rem");
  bottomLinkCommentsCounter.css("top", "1px");
}