function getHeadline() {
  return $("h1 > span.headline").text();
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
  var headerElement = $("h1 > span.headline");

  if(displayHeaderIconButton) {
    return addHackElement(headerElement, true, "headline");
  }
  else {
    return addHackElement(headerElement, false, "headline");
  }
}

function getTopLinkElement() {
  return $("div.socialMedia");
}

function getBottomLinkElement() {
  if($("div > h2.conHeadline").length != 0) {
    return $("div > h2.conHeadline");
  }
  else {
    return $($("div.box")[1]);
  }
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(!displayButton) {
    headerIcon.css("top", "-7px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.addClass("small");
  topLinkBox.append("<br />");
  topLinkHref.css("font-weight", "bold").css("font-size", "1.1rem");

  if(displayLinkIconButton) {
    topLinkIcon.css("top", "1px");
  } 
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  bottomLinkBox.css("top", "10px");
  bottomLinkHref.css("font-size", "1.1rem").css("font-weight", "bold");
  bottomLinkCommentsCounter.css("font-size", "1rem");
  bottomLinkCommentsCounter.css("top", "-8px");

  if(displayLinkIconButton) {
    bottomLinkIcon.css("top", "1px");
  }

  // No comments active
  if($("div > h2.conHeadline").length == 0) {
    bottomLinkBox.addClass("small");
  }
}