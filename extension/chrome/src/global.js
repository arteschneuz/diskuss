var commonSettingsKeys = ["settingsCommonDisplayHeaderIcon", "settingsCommonMouseOverDisplay", "settingsCommonDisplayHeaderIconAsButton", "settingsCommonDisplayLinkIconAsButton", "settingsCommonDisplayLinkProjectName"];
var globals = null;
var sessionInited = false;
var appServer = "http://diskuss.no-ip.org";
var sourceRoot = "diskuss";

// Load media data and set interval for updating media data
updateGlobals();
window.setInterval(function() { updateGlobals() }, 1000 * 60);

function updateGlobals() {
  var request = new XMLHttpRequest();
  request.open('GET', appServer + "/" + sourceRoot + "/script/global.json?" + new Date().getTime(), true);
  request.send(null);

  request.onreadystatechange = function(e) {
    if(request.readyState == 4) {
      if(request.status == 200) {
        globals = JSON.parse(request.responseText);

        if(!sessionInited) {
          sessionInited = true;

          if(!localStorage.getItem("displayPosition")) {
            // First usage of extension
            setDefaultOptionValues(); 
          }
        }
      
        setNewMediaDefault(); 
      }
    }
  };
}

function setNewMediaDefault() {
  for(var i in globals.mediaData) {
    if(!localStorage.getItem(globals.mediaData[i].id)) {
      localStorage.setItem(globals.mediaData[i].id, true);
    }
  }
}

function saveOption(key, value) {
  localStorage.setItem(key, value);
}

function setDefaultOptionValues() { 
  // Display header icon 
  localStorage.setItem(commonSettingsKeys[0], true);
  // Display comment box after mouseover event
  localStorage.setItem(commonSettingsKeys[1], true);
  // Header button instead of balloon
  localStorage.setItem(commonSettingsKeys[2], false);
  // Link section button instead of balloon
  localStorage.setItem(commonSettingsKeys[3], true);
  // Display project name in link text 
  localStorage.setItem(commonSettingsKeys[4], false);

  // Media values
  for(var i in globals.mediaData) {
    localStorage.setItem(globals.mediaData[i].id, true); 
  }
  
  // Display position
  localStorage.setItem("displayPosition", 2);  
}

function getActiveMediaHeader() {
  var activeMediaSources = 0;
  var activeUserMediaSources = 0;

  for(var i in globals.mediaData) {
    if(globals.mediaData[i].active) {
      activeMediaSources++;

      if(localStorage.getItem(globals.mediaData[i].id) == "true") { 
        activeUserMediaSources++;
      }
    }
  }
 
  return chrome.i18n.getMessage("settingsHeaderMedia") + " [" + activeMediaSources + ":" + activeUserMediaSources + "]";
}

chrome.runtime.onMessage.addListener(
  function(request, sender, response) {
    if(request == "globals") {
      response(globals);
    }
    else if(request.key == "getOptionValue") {
      response({ key: request.optionKey, optionValue: localStorage.getItem(request.optionKey) });
    }
    else if(request.key == "setOptionValue") {
      localStorage.setItem(request.optionKey, request.optionValue);
    }
    else if(request.key == "setDefaultOptions") {
      setDefaultOptionValues();
      response();
    }
    else if(request.key == "getCommonSettingsKeys") {
      response({ keys: commonSettingsKeys });
    }
    else if(request.key == "getActiveMediaHeader") {
      response(getActiveMediaHeader());
    }
    else if(request.key == "getControllerSettings") {
      var displayPositionValue = localStorage.getItem("displayPosition");
      var controllerSettings = { matchingMediaId: request.matchingMediaId,
        matchingMediaTargetKey: request.matchingMediaTargetKey,
        globals: globals,
        linkText: localStorage.getItem("settingsCommonDisplayLinkProjectName") == "true" ? chrome.i18n.getMessage("mediaPageLinkTextProject") : chrome.i18n.getMessage("mediaPageLinkText"),
        commentsCounterText1: chrome.i18n.getMessage("mediaPageCommentText1"),
        commentsBoxNoPost: chrome.i18n.getMessage("commentsBoxNoPost"),
        commentsCounterTextX: chrome.i18n.getMessage("mediaPageCommentTextX"),
        displayHeaderIcon: localStorage.getItem("settingsCommonDisplayHeaderIcon") == "true",
        displayTopLink: displayPositionValue == "-1" || displayPositionValue == "2",
        displayBottomLink: displayPositionValue == "1" || displayPositionValue == "2",
        displayHeaderIconButton: localStorage.getItem("settingsCommonDisplayHeaderIconAsButton") == "true",
        displayCommentsOnMouseOver: localStorage.getItem("settingsCommonMouseOverDisplay") == "true",
        displayLinkIconButton: localStorage.getItem("settingsCommonDisplayLinkIconAsButton") == "true"
      };

      response(controllerSettings);
    }
  }
);