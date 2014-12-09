function getHeadline() {
  return $("h2.article-title > span").get(1).textContent;
}

function getMetaHeadline() {
  return $("h2.article-title > span").first().text();
}

function getIntroduction() {
  return $("p.article-intro > strong").first().text();
}

function getAuthors() {
  return $("p.author > a").first().text();
}

function getArticleDate() {
  return $("time").first().attr("datetime");
}

function getArticleDatePattern() {
  return "dd.MM.yyyy' - 'hh:mm:ss";
}

function getTopLinkElement() { 
  return $("div.social-media-box").first();
}

function getBottomLinkElement() {
  return $("div.fb-twitter-bar-bottom");
}

function getHeadlineElement(displayHeaderIconButton) {
  if(displayHeaderIconButton) {
    return $("h2 > span.headline-intro");
  }
  else {
    return $("h2 > span.headline");
  }
}

function setHeaderIconStyle(headerIcon, displayButton) {
  if(!displayButton) {
    headerIcon.css("top", "-8px").css("left", "-1px");
  }
}

function setTopLinkStyle(topLinkBox, topLinkIcon, topLinkHref, topLinkCommentsCounter, displayLinkIconButton) {
  // Div box
  if(!displayLinkIconButton) {
    topLinkBox.css("top", "17px");
    // Space between lines
    topLinkBox.append("<span style=\"font-size: 1px\"><br /></span>");
  }
  else {
    topLinkBox.css("top", "7px");
  }

  // Link text
  topLinkHref.css("font-size", "1.3rem").css("font-weight", "bold");
  // Comment text
  topLinkCommentsCounter.css("font-size", "1.3rem");
}

function setBottomLinkStyle(bottomLinkBox, bottomLinkIcon, bottomLinkHref, bottomLinkCommentsCounter, displayLinkIconButton) {
  // Div box
  bottomLinkBox.css("top", "15px");
  // Link text
  bottomLinkHref.css("font-size", "1.3rem").css("font-weight", "bold");
  // Comment text
  bottomLinkCommentsCounter.css("font-size", "1.3rem");
}