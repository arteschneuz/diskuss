function getHeadline() {
  return $("#article-container > div > h1 > span")[1].textContent;
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

function getHeadlineElement(displayHeaderIconButton) {
  var headlineElement = $($("#article-container > div > h1 > span")[1]);

  if(displayHeaderIconButton) {
    return addHackElement(headlineElement, true, "headline");
  }
  else {
    return addHackElement(headlineElement, false, "headline");
  }
}

function getTopLinkElement() {
  return $("#article-container > div.article-header");
}

function getBottomLinkElement() {
  return $("#article-content").find("div.description");
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(displayButton) {
    headerIcon.css("top", "48px");
  }
  else {
    headerIcon.css("top", "38px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.css("top", "-25px");

  if(displayLinkIconButton) {
    topLinkIcon.css("top", "21px");
  }
  else {
    topLinkIcon.css("top", "15px");
  }

  topLinkCommentsCounter.css("top", "2px");
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  bottomLinkHref.css("font-weight", "bold").css("color", "#fa7d19").css("font-size", "0.8rem");
  bottomLinkCommentsCounter.css("top", "-2px").css("font-size", "0.8rem");

  if(displayLinkIconButton) {
    bottomLinkIcon.css("top", "23px");
  }
  else {
    bottomLinkIcon.css("top", "15px");
  }
}