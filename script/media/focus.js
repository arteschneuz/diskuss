function getHeadline() {
  return $("#article > div > div > h1.articleIdentH1").contents()[1].textContent;
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
  return $("#article > div > div.articleHead");
}

function getBottomLinkElement() {
  return $("#fb-root.fb_reset");
}

function getHeadlineElement(displayHeaderIconButton) {
  var headerElement = $("#article > div > div > h1.articleIdentH1");

  if(!displayHeaderIconButton) {
    return addHackElement(headerElement, displayHeaderIconButton, "header");
  }
  else {
    return replaceHackElement(headerElement, "</span>", "header");
  }
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(displayButton) {
    headerIcon.css("top", "-2px");
  }
  else {
    headerIcon.css("top", "-10px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.prepend("<span><br /></span>");
  topLinkHref.css("font-size", "1rem");
  topLinkCommentsCounter.css("font-size", "0.8rem");
  topLinkCommentsCounter.css("top", "2px");

  if(displayLinkIconButton) {
    topLinkIcon.css("top", "1px");
  }
  else {
    topLinkIcon.css("top", "-7px").css("left", "4px");
  }
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  bottomLinkBox.css("font-family", "arial,sans-serif");
  bottomLinkHref.css("font-size", "1rem");
  bottomLinkCommentsCounter.css("font-size", "0.8rem");
  bottomLinkCommentsCounter.css("top", "4px");

  if(displayLinkIconButton) {
    bottomLinkIcon.css("top", "1px");
  }
  else {
    bottomLinkIcon.css("top", "-7px").css("left", "4px");
  }
}

