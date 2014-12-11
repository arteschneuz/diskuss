function getHeadline() {
  return getHeadlineElement().text();
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
  return $("div div h1 span.title");
}

function getTopLinkElement() { 
  return $("div div.articlemeta");
}

function getBottomLinkElement() {
   return addHackElement($("#smk-plug"), true, "bottom");
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(displayButton) {
    $("span.title").css("display", "inline");
    headerIcon.css("top", "-3px");
  }
  else {
    headerIcon.css("top", "-10px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.css("top", "-10px");
  topLinkHref.css("font-weight", "bold");
  topLinkCommentsCounter.css("top", "2px");
  topLinkBox.html("<br />" + topLinkBox.html());
  
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  bottomLinkBox.css("top", "-20px");
  bottomLinkHref.css("font-weight", "bold").css("font-size", "90%");
  bottomLinkCommentsCounter.css("top", "3px").css("font-size", "85%");
}