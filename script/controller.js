document.addEventListener("checkMatchingMedia", isMatchingMediaArticle);
document.addEventListener("initController", initController);
var settings = null;
var communityInfos = null;
var mouseLeaveCommentsIconInterval = null;
var debug = false;

// Check loaded page matches known media article
function isMatchingMediaArticle(e) {
  // If header exists and insert element for the top and bottom link, then here we go!
  var matchingMediaArticle = false;

  try {
    matchingMediaArticle = isNotEmpty(getHeadline()) && isNotEmpty(getTopLinkElement()) && isNotEmpty(getBottomLinkElement());
  }
  catch(ex) {
    handleException(ex, "isMatchingMediaArticle");
  }

  if(debug) {
    alert("headline: " + getHeadline());
    alert("topLinkElement: " + getTopLinkElement());
    alert("getBottomLinkElement: " + getBottomLinkElement());
  }

  // Fire event
  if(matchingMediaArticle) {
    var matchingMediaArticleEvent = new CustomEvent("reportMatchingMedia");
    document.dispatchEvent(matchingMediaArticleEvent);
  }
}

function isNotEmpty(obj) {
  return obj && !jQuery.isEmptyObject(obj);
}

function handleException(ex, source) {
  console.error("ERROR in " + source + " " + ex);
}

function initController(e) {
  settings = e.detail;

  // Get category feed
  makeAJAXCall(settings.globals.googleAPIsUrl + encodeURIComponent(settings.globals.commentServer + "/category/" + settings.matchingMediaTargetKey + "/feed?" + new Date().getTime()), 'jsonp', categoryFeedsCallback);
}

function categoryFeedsCallback(response) {
  if(response.responseStatus == 200) {
    var mediaURL = new String(window.location);
    var communityResponse = $.parseXML(response.responseData.xmlString);
    var items = $(communityResponse).find("item");

    if(!$.isEmptyObject(items[0])) {
      for(var i = 0; i < items.length; i++) {
        var description = $($(items[i]).find("description")[0]).text();
        var communityMediaURL = description.substring(0, description.indexOf("<"));

        // Check matching media page
        if(communityMediaURL && mediaURL.indexOf(communityMediaURL) != -1) {
          // Found matching article, get comments and url
          var commentsCounter = $($(items[i]).find("comments")[1]).text();
          var externalLink = $($(items[i]).find("link")[0]).text();
          var displayCommentsCounter = commentsCounter > 3 ? 3 : commentsCounter;
          var externalCommentsLink = $($(items[i]).find("comments")[0]).text();

          // Save community infos
          communityInfos = { commentsCounter: commentsCounter, externalLink: externalLink, externalCommentsLink: externalCommentsLink, existingArticle: true, commentsInfos: (displayCommentsCounter > 0 ? new Array(displayCommentsCounter) : null) };
          break;
        }
      }
    }

    // Check community infos
    if(communityInfos == null) {
      // Unknown article
      communityInfos = { commentsCounter: 0, externalLink: null, externalCommentsLink: settings.globals.commentServer + "/" + settings.globals.commentServerUnknownLink, existingArticle: false, commentsInfos: null };

      // Render page
      renderMediaPage();
    }
    else {
      // Known article, call comments feed
      makeAJAXCall(settings.globals.googleAPIsUrl + encodeURIComponent(communityInfos.externalLink + "/feed?" + new Date().getTime()), 'jsonp', communityArticleInfosCallback);
    }
  }
}

function communityArticleInfosCallback(response) {
  if(response.responseStatus == 200) {
    var commentsResponse = $.parseXML(response.responseData.xmlString);
    var items = $(commentsResponse).find("item");

    if(!$.isEmptyObject(items[0])) {
      for(var i = 0; i < items.length; i++) {
        var author = $($(items[i]).find("title")[0]).text().substring(5);
        var link = $($(items[i]).find("link")[0]).text();
        var timestamp = $($(items[i]).find("pubDate")[0]).text().substring(0, 25);
        var text = $($(items[i]).find("description")[0]).text();
        var code = $($(items[i]).find("encoded")[0]).text();
     
        // Set community infos
        communityInfos.commentsInfos[i] = { author: author, link: link, timestamp: timestamp, text: text, code: code };
      }
    }

    // Render page
    renderMediaPage();
  }
}

function makeAJAXCall(url, dataType, callback) {
  $.ajax({
    url: url,
    success: callback,
    dataType: dataType
  });
}

function renderMediaPage() {
  var linkCommentsCounterText = (communityInfos.commentsCounter == 1 ? settings.commentsCounterText1 : settings.commentsCounterTextX.replace("{0}", communityInfos.commentsCounter));
  var topLinkElement = null;
  var bottomLinkElement = null;
  var headlineElement = null;
  var linkCommentsCounterText = null;

  try {
    linkCommentsCounterText = (communityInfos.commentsCounter == 1 ? settings.commentsCounterText1 : settings.commentsCounterTextX.replace("{0}", communityInfos.commentsCounter));
    topLinkElement = getTopLinkElement();
    bottomLinkElement = getBottomLinkElement();
    headlineElement = getHeadlineElement(settings.displayHeaderIconButton);
  }
  catch(ex) {
    handleException(ex, "renderMediaPage init section");
  }
 
  // Render top link section
  if(settings.displayTopLink && isNotEmpty(topLinkElement)) {
    try {
      // Set top link element
      setLinkElement(topLinkElement, true, settings.displayLinkIconButton);
      // Set top link text
      $("#" + settings.globals.projectKey + "-top-link-link").text(settings.linkText);
      // Set top link comments counter text
      $("#" + settings.globals.projectKey + "-top-link-comments-counter-box").text(linkCommentsCounterText);
      // Set top link style
      setTopLinkStyle($("#" + settings.globals.projectKey + "-top-link-box"), $("#" + settings.globals.projectKey + "-icon-top"), $("#" + settings.globals.projectKey + "-top-link-link"), $("#" + settings.globals.projectKey + "-top-link-comments-counter-box"), settings.displayLinkIconButton);
    }
    catch(ex) {
      handleException(ex, "renderMediaPage top link section");
    }
  }

  // Render bottom link section
  if(settings.displayBottomLink && isNotEmpty(bottomLinkElement)) {
    try {
      // Set bottom link element
      setLinkElement(bottomLinkElement, false, settings.displayLinkIconButton);
      // Set bottom link text
      $("#" + settings.globals.projectKey + "-bottom-link-link").text(settings.linkText);
      // Set bottom link comments counter text
      $("#" + settings.globals.projectKey + "-bottom-link-comments-counter-box").text(linkCommentsCounterText);
      // Set top link comments counter text
      setBottomLinkStyle($("#" + settings.globals.projectKey + "-bottom-link-box"), $("#" + settings.globals.projectKey + "-icon-bottom"), $("#" + settings.globals.projectKey + "-bottom-link-link"), $("#" + settings.globals.projectKey + "-bottom-link-comments-counter-box"), settings.displayLinkIconButton);
    }
    catch(ex) {
      handleException(ex, "renderMediaPage bottom link section");
    }
  }

  // Render header section
  if(settings.displayHeaderIcon && isNotEmpty(headlineElement)) {
    try {
      var iconToDisplay = settings.displayHeaderIconButton ? "16-button" : "16-balloon";
      var htmlTodisplay = "<img id=\"" + settings.globals.projectKey + "-icon-header\" src=\"" + settings.globals.server + "/" + settings.globals.sourceRoot + "/img/" + iconToDisplay + ".png\" style=\"display: inline; cursor:pointer; border: 0px; position: relative\" />";

      if(settings.displayHeaderIconButton) {
        headlineElement.before(htmlTodisplay + " ");
      }
      else {
        headlineElement.append(" " + htmlTodisplay);
      }

      setHeaderIconStyle($("#" + settings.globals.projectKey + "-icon-header"), settings.displayHeaderIconButton);
    }
    catch(ex) {
      handleException(ex, "renderMediaPage headline section");
    }
  }

  try {
    // Render comments section
    var projectLinkColor = "rgb(255, 65, 10)";
    $($("body")[0]).append("<div id=\"" + settings.globals.projectKey + "-comments-box" + "\" style=\"word-wrap:break-word; font-size: 13px; color: black; box-shadow: 0 0 5px 5px rgb(200, 200, 200); font-family: Verdana;  position: absolute; z-index: 999; width: 400px; top: 10px; left: 10px; border: 1px solid rgb(177, 177, 185); background: rgb(230, 230, 230); display: none\"></div>");
    var commentsBox = $("#" + settings.globals.projectKey + "-comments-box");
    // Append header
    commentsBox.append("<div style=\"height: 50px; z-index: 1000; border-bottom: 1px solid rgb(177, 177, 185)\"><img src=\"" + settings.globals.server + "/" + settings.globals.sourceRoot + "/img/logo.png" + "\" style=\"border: 0px; width: 80px; height: 20px; padding-left: 7px; padding-top: 17px\" /></div>");
    // Append comments box
    commentsBox.append("<div id=\"" + settings.globals.projectKey + "-comments-box-comments-box\"></div>");
    var commentsCommentsBox = $("#" + settings.globals.projectKey + "-comments-box-comments-box");
    var htmlInfoLine = "<div style=\"{1}z-index: 1000; font-family: Verdana; background: rgb(245, 245, 245); padding: 12px\">{0}</div>";
    
    // Append infos
    if(communityInfos.commentsInfos) {
      for(var i = 0; i < communityInfos.commentsInfos.length; i++) {
        var postDate = new Date(communityInfos.commentsInfos[i].timestamp + " UTC");
        var comment = "<a style=\"color: " + projectLinkColor + "; font-weight: bold; font-size: 12px; outline: none; text-decoration: none; font-style: italic\" target=\"_blank\" href=\"" + communityInfos.commentsInfos[i].link + "\">" + communityInfos.commentsInfos[i].author + "</a> <span style=\"font-size: 11px; font-style: italic\">" + postDate.toLocaleString() + "</span><br />";
        var appendHtml = htmlInfoLine;

        // Adjust code
        var commentCode = $("<span></span>");
        commentCode.html(communityInfos.commentsInfos[i].code);
        // Set link
        commentCode.find("a").css("color", "rgb(234, 94, 0)").attr("target", "_blank");
        commentCode.find("img").css("max-width", "100%");
        comment += commentCode.html();
        // Set bottom line
        if((i + 1) != communityInfos.commentsInfos.length) {
          appendHtml = appendHtml.replace("{1}", "border-bottom: 1px solid rgb(177, 177, 185);");
        }
        else {
          appendHtml = appendHtml.replace("{1}", "");
        }

        commentsCommentsBox.append(appendHtml.replace("{0}", comment));
      }
    }
    else {
      commentsBox.append(htmlInfoLine.replace("{0}", settings.commentsBoxNoPost));
    }

    commentsBox.show();
    var commentsCommentsBoxHeight = commentsCommentsBox.height();
    commentsBox.hide();

    // Handle scroll bar
    if(commentsCommentsBoxHeight > 400) {
      commentsCommentsBox.css("overflow-x", "hidden").css("overflow-y", "scroll").css("height", "400px");
    }
  
    // Append footer
    commentsBox.append("<div style=\"z-index: 1000; border-top: 1px solid rgb(177, 177, 185); padding: 12px; font-family: Verdana;\"><a style=\"font-weight: bold; outline: none; text-decoration: none; font-size: 13px; color: " + projectLinkColor + "\" target=\"_blank\" href=\"" + communityInfos.externalCommentsLink + "\">" + settings.linkText + "</a><br /><span style=\"color: black; font-size: 11px; font-family: Verdana;\">" + linkCommentsCounterText + "</span></div>");

    // Add mouseover support, if active
    if(settings.displayCommentsOnMouseOver) {
      // Hide box after mouseout event
      $("#" + settings.globals.projectKey + "-comments-box").mouseleave(hideCommentsBox);
      $("#" + settings.globals.projectKey + "-comments-box").mouseenter(enterCommentsBox);

      // Header icon
      var headerIcon = $("#" + settings.globals.projectKey + "-icon-header");

      if(headerIcon.length > 0) {
        headerIcon.mouseenter(function () { displayCommentsBox(headerIcon); });
        headerIcon.mouseleave(function () { leaveCommentsBoxIcon(headerIcon); });
      }

      // Top link icon
      var topLinkIcon = $("#" + settings.globals.projectKey + "-icon-top");

      if(topLinkIcon.length > 0) {
        topLinkIcon.mouseenter(function () { displayCommentsBox(topLinkIcon); });
        topLinkIcon.mouseleave(function () { leaveCommentsBoxIcon(topLinkIcon); });
      }

      // Bottom link icon
      var bottomLinkIcon = $("#" + settings.globals.projectKey + "-icon-bottom");

      if(bottomLinkIcon) {
        bottomLinkIcon.mouseenter(function () { displayCommentsBox(bottomLinkIcon); });
        bottomLinkIcon.mouseleave(function () { leaveCommentsBoxIcon(bottomLinkIcon); });
      }
    }
  }
  catch(ex) {
    handleException(ex, "renderMediaPage comments box section");
  }
}

function enterCommentsBox() {
  // Reset interval
  mouseLeaveCommentsIconInterval = null;
}

function displayHideCommentsBox(target) {
  if($("#" + settings.globals.projectKey + "-comments-box").css("display") == "none") {
    displayCommentsBox(target);
  }
  else {
    hideCommentsBox();
  }
}

function displayCommentsBox(target) {
  target = $(target);

  var iconElement = $("#" + target.attr("id"));
  var commentsBox = $("#" + settings.globals.projectKey + "-comments-box");

  // Reset interval
  mouseLeaveCommentsIconInterval = null;

  var iconWidth = iconElement.width();
  var displayMarginV = 10;
  var displayMarginH = 20;
  var scrollTop = $(window).scrollTop();
  var scrollLeft = $(window).scrollLeft();
  var iconDocumentX = iconElement.offset().left;
  var iconDocumentY = iconElement.offset().top;
  var iconScreenX = iconDocumentX - scrollLeft;
  var iconScreenY = iconDocumentY - scrollTop;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var vSpaceTop = iconScreenY;
  var vSpaceBottom = windowHeight - vSpaceTop;
  var hSpaceLeft = iconScreenX;
  var hSpaceRight = windowWidth - (iconScreenX + iconWidth);
  var commentsBoxHeight = commentsBox.height();
  var commentsBoxWidth = commentsBox.width();
  var displayRight = false;
  var displayCommentsBoxX = 0;
  var displayCommentsBoxY = 0;

  // Check vertically display 
  if(hSpaceRight >= (commentsBoxWidth + (2* displayMarginV))) {
    displayRight = true;
  }
  // Check default, not enough space right and left, display always right
  else if(hSpaceLeft < (commentsBoxWidth + (2 * displayMarginV))) {
    displayRight = true;
  }

  // Check horizontally insufficient space
  if(windowHeight < (commentsBoxHeight + (displayMarginH * 2))) {
    displayCommentsBoxY = scrollTop + displayMarginH;
  }
  // Check sufficient space horizontally beneath top of icon
  else if(vSpaceBottom >= (commentsBoxHeight + (2 * displayMarginH))) {
    displayCommentsBoxY = iconDocumentY - displayMarginH;
  }
  else {
    displayCommentsBoxY = (windowHeight + scrollTop) - (commentsBoxHeight + (displayMarginH * 2));
  }

  if(displayRight) {
    displayCommentsBoxX = iconDocumentX + iconWidth + displayMarginV;
  }
  else {
    displayCommentsBoxX = iconDocumentX - displayMarginV - commentsBoxWidth;
  }

  // Set commentsbox coordinates
  commentsBox.css("left", displayCommentsBoxX + "px").css("top", displayCommentsBoxY + "px");
  // Hide comments box
  commentsBox.fadeIn(500);
}

function leaveCommentsBoxIcon(target) {
  mouseLeaveCommentsIconInterval = mouseLeaveCommentsIconInterval = window.setTimeout(leaveCommentsBoxIconCallback, 1000);
}

function leaveCommentsBoxIconCallback() {
  if(mouseLeaveCommentsIconInterval) {
    mouseLeaveCommentsIconInterval = null;
    hideCommentsBox();
  }
}

function hideCommentsBox() {
  $("#" + settings.globals.projectKey + "-comments-box").fadeOut(500);
}

$(document).keyup(function (e) {
  if(e.keyCode == 27) {
    hideCommentsBox();
  }
});

$(document).click(function (e) {
  var container = $("#" + settings.globals.projectKey + "-comments-box");

  if(isIconElement(e.target)) {
    displayHideCommentsBox(e.target)
  }
  else if(!container.is(e.target) && container.has(e.target).length === 0) {
    hideCommentsBox();
  }
});

function isIconElement(target) {
  return target.id && target.id.indexOf(settings.globals.projectKey + "-icon-") == 0;
}

function setLinkElement(appendElement, top) {
  var iconToDisplay = settings.displayLinkIconButton ? "16-button" : "16-balloon";
  var htmlToDisplay = "<div style=\"overflow: visible; position: relative; float: none\" id=\"" + settings.globals.projectKey + "-" + (top ? "top" : "bottom") + "-link-box\"><div style=\"position: relative\" id=\"" + settings.globals.projectKey + "-" + (top ? "top" : "bottom") + "-link-link-box\">{0}<a id=\"" + settings.globals.projectKey + "-" + (top ? "top" : "bottom") + "-link-link\" href=\"" + communityInfos.externalCommentsLink + "\" target=\"_blank\" style=\"position: relative;{3}\"></a>{1}</div><div style=\"position: relative;\" id=\"" + settings.globals.projectKey + "-" + (top ? "top" : "bottom") + "-link-comments-counter-box\"></div></div>";
  var linkIconToAppend = "<img id=\"" + settings.globals.projectKey + "-icon-" + (top ? "top" : "bottom") + "\" src=\"" + settings.globals.server + "/" + settings.globals.sourceRoot + "/img/" + iconToDisplay + ".png\" style=\"display: inline; border: 0px; cursor:pointer; position: relative; {2}\" />";
  var linkIconStyleToAppend = settings.displayLinkIconButton ? "top: 3px;" : "top: -5px; left: 1px";

  if(settings.displayLinkIconButton) {
    htmlToDisplay = htmlToDisplay.replace("{0}", linkIconToAppend).replace("{1}", "").replace("{3}", "left: 3px");
  }
  else {
    htmlToDisplay = htmlToDisplay.replace("{1}", " " + linkIconToAppend).replace("{0}", "").replace("{3}", "");
  }

  appendElement.append(htmlToDisplay.replace("{2}", linkIconStyleToAppend));
}

function appendOuterHTML(fromElement, id) {
  try {
    if($("#hack-" + id).length == 0) {
      var html = fromElement[0].outerHTML;
      fromElement[0].outerHTML = html + "<span id=\"hack-" + id + "\"></span>";
    }
  }
  catch(ex) {
    handleException(ex, "appendOuterHTML");
  }

  return $("#hack-" + id);
}

function replaceHackElement(fromElement, replaceMarker, id) {
  try {
    if($("#hack-" + id).length == 0) {
      var html = fromElement.html();
      html = html.replace(replaceMarker, replaceMarker + "<span id=\"hack-" + id + "\"></span>");
      fromElement.html(html);
    }
  }
  catch(ex) {
    handleException(ex, "replaceHackElement");
  }

  return $("#hack-" + id);
}

function addHackElement(fromElement, before, id) {
  try {
    if($("#hack-" + id).length == 0) {
      var html = fromElement.html();
      var hackElement = "<span id=\"hack" + "-" + id + "\"></span>";

      if(before) {
        fromElement.html(hackElement + html);
      }
      else {
        fromElement.html(html + hackElement);
      }
    }
  }
  catch(ex) {
    handleException(ex, "addHackElement");
  }

  return $("#hack" + "-" + id);
}

function printMediaData() {
  var headline = null;
  var metaHeadline = null;
  var introduction = null;
  var authors = null;
  var articleDate = null;
  var topLinkElement = null;
  var bottomLinkElement = null;
  var headlineElementTrue = null;
  var headlineElementFalse = null;

  try {
    headline = getHeadline();
  }
  catch(ex) {
    handleException(ex, "getHeadline");
  }

  try {
    metaHeadline = getMetaHeadline();
  }
  catch(ex) {
    handleException(ex, "getMetaHeadline");
  }

  try {
    introduction = getIntroduction();
  }
  catch(ex) {
    handleException(ex, "getIntroduction");
  }

  try {
    authors = getAuthors();
  }
  catch(ex) {
    handleException(ex, "getAuthors");
  }

  try {
    articleDate = getArticleDate();
  }
  catch(ex) {
    handleException(ex, "getArticleDate");
  }

  try {
    topLinkElement = getTopLinkElement();
  }
  catch(ex) {
    handleException(ex, "getTopLinkeElement");
  }

  try {
    bottomLinkElement = getBottomLinkElement();
  }
  catch(ex) {
    handleException(ex, "getBottomLinkElement");
  }

  try {
    headlineElementTrue = getHeadlineElement(true);
  }
  catch(ex) {
    handleException(ex, "getHeadlineElement(true)");
  }

  try {
    headlineElementFalse = getHeadlineElement(false);
  }
  catch(ex) {
    handleException(ex, "getHeadlineElement(false)");
  }

  alert("Headline: " + headline + "\n---\n" +
        "Meta Headline: " + metaHeadline + "\n---\n" +
        "Introduction: " + introduction + "\n---\n" + 
        "Authors: " + authors + "\n---\n" + 
        "Article Date: " + articleDate + "\n---\n" + 
        "Top Link Element: " + topLinkElement + "\n---\n" + 
        "Bottom Link Element: " + bottomLinkElement + "\n---\n" + 
        "Headline Element (true): " + headlineElementTrue + "\n---\n" + 
        "Headline Element (false) " + headlineElementFalse);
}