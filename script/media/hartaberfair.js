function getHeadline() {
  return $($("div.teaser > h4.headline")[0]).text();
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
  return addHackElement($($("div.teaser > h4.headline")[0]), displayHeaderIconButton, "header");
}

function getTopLinkElement(init) {
  return $($("div > div.box > div.teaser")[0]);
}

function getBottomLinkElement(init) {
  var bottomElement = null;
  var teasers = $("div > div.box > div.teaser");

  for(var i = 0; i < teasers.length; i++ ) {
    if($(teasers[i]).text().indexOf("Ihre Meinung") != -1) {
      bottomElement = addHackElement($(teasers[i]), false, "bottom");
      break;
    }
  }

  return bottomElement;
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(!displayButton) {
    headerIcon.css("top", "-7px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  topLinkBox.css("top", "15px").css("left", "10px").css("width", "50%").css("float", "right");
  topLinkHref.css("font-weight", "bold");
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  bottomLinkHref.css("font-weight", "bold");
  bottomLinkBox.css("float", "left");
}