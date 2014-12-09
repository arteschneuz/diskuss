// Includes
var self = require("sdk/self");
var windows = require("sdk/window/utils");
var request = require("sdk/request").Request;
var timer = require('sdk/timers');
var addonCache = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var isString = require('sdk/lang/type').isString;

// Global variables
var localizedMessages = null;
var globals = null;
var appServer = "http://188.194.18.92:8088";
var sourceRoot = "diskuss";
var sessionInited = false;
var optionsWorker = null;
var commonSettingsKeys = ["settingsCommonDisplayHeaderIcon", "settingsCommonMouseOverDisplay", "settingsCommonDisplayHeaderIconAsButton", "settingsCommonDisplayLinkIconAsButton", "settingsCommonDisplayLinkProjectName"];

// Since SDK does not yet support default locale, we load the supported JSON locale messages through XHR
// English is the default language and so far German is also supported. For now, we use the localized browser settings.
var window = windows.getMostRecentBrowserWindow();
var browserLanguageSettings = window.navigator.language;
var locale = "en";

if(browserLanguageSettings.startsWith("de")) {
  locale = "de";
}

var localeFileUrl = self.data.url("locale/" + locale + "/messages.json");

// Get localized messages
request({
  url: localeFileUrl,

  onComplete: function (response) {
    localizedMessages = response.json;

    // Localized message mapping done, now we start the timer for getting and auto-updating the global settings
    timer.setInterval(getGlobalSettings, 1000 * 10);
    // Get the global settings
    getGlobalSettings();
  }
}).get();

tabs.on("ready", handlePageLoaded);

function getGlobalSettings() {
  request({
    url: appServer + "/" + sourceRoot + "/script/global.json?" + new Date().getTime(),

    onComplete: function (response) {
      globals = response.json;

      // Check settings icon label set
      if(settingsIcon && settingsIcon.label == "_") {
        // Set localized label
        settingsIcon.label = localizedMessages["settingsIconLabel"].message;
      }

      // Check session inited
      if(!sessionInited) {
        sessionInited = true;

        if(!addonCache.storage["displayPosition"]) {
          // First usage of extension
          setDefaultOptionValues();
        }
      }

      // Update new or unknown media sources to default
      setNewMediaDefault();
    }
  }).get();
}

function setNewMediaDefault() {
  for(var i in globals.mediaData) {
    var storedValue = addonCache.storage[globals.mediaData[i].id];

    if(storedValue != true && storedValue != false) {
      addonCache.storage[globals.mediaData[i].id] = true;
    }
  }
}

function setDefaultOptionValues() {
  // Display header icon 
  addonCache.storage[commonSettingsKeys[0]] = true;
  // Display comment box after mouseover event
  addonCache.storage[commonSettingsKeys[1]] = true;
  // Header button instead of balloon
  addonCache.storage[commonSettingsKeys[2]] = false;
  // Link section button instead of balloon
  addonCache.storage[commonSettingsKeys[3]] = true;
  // Display project name in link text 
  addonCache.storage[commonSettingsKeys[4]] = false;

  // Media values
  for(var i in globals.mediaData) {
    addonCache.storage[globals.mediaData[i].id] = true;
  }

  // Display position
  addonCache.storage["displayPosition"] = 2;
}

var settingsIcon = require("sdk/ui/button/action").ActionButton({
  id: "settings-icon",
  icon: "./img/16.png",
  label: "_",

  onClick: function () {
    // Since SDK does not yet support dynamic preferences, we handle the preferences with a custom options page
    tabs.open(self.data.url("options.htm"));
  }
});

function getOptionActiveMediaHeader() {
  var activeMediaSources = 0;
  var activeUserMediaSources = 0;

  for(var i in globals.mediaData) {
    if(globals.mediaData[i].active) {
      activeMediaSources++;

      if(addonCache.storage[globals.mediaData[i].id]) {
        activeUserMediaSources++;
      }
    }
  }
   
  return localizedMessages["settingsHeaderMedia"].message + " [" + activeMediaSources + ":" + activeUserMediaSources + "]";
}

function handlePageLoaded(tab) {
  var pageUrl = tab.url;

  // Handle options page
  if(pageUrl.indexOf("options.htm") != -1) {
    optionsWorker = tab.attach({ contentScriptFile: [self.data.url("options.js")],
      onMessage: optionsMessageCallback
    });
  }
  else {
    // Include content script
    var contentWorker = tab.attach({ contentScriptFile: [self.data.url("content.js")]
    });

    contentWorker.port.on("getExchangeData", function() {
      contentWorker.port.emit("getExchangeData", { globals: globals, commonSettingsKeys: commonSettingsKeys, localizedMessages: localizedMessages, selfData: self.data.url() });
    });
    contentWorker.port.on("getOptionValue", function(message) {
      contentWorker.port.emit("getOptionValue", { optionKey: message.optionKey, optionValue: addonCache.storage[message.optionKey] });
    });
    contentWorker.port.on("getControllerSettings", function(message) {
      var displayPositionValue = addonCache.storage["displayPosition"];
      // Assemble controller settings
      var controllerSettings = {
        matchingMediaId: message.matchingMediaId,
        matchingMediaTargetKey: message.matchingMediaTargetKey,
        globals: globals,
        linkText: addonCache.storage["settingsCommonDisplayLinkProjectName"] == true ? localizedMessages["mediaPageLinkTextProject"].message : localizedMessages["mediaPageLinkText"].message,
        commentsCounterText1: localizedMessages["mediaPageCommentText1"].message,
        commentsBoxNoPost: localizedMessages["commentsBoxNoPost"].message,
        commentsCounterTextX: localizedMessages["mediaPageCommentTextX"].message,
        displayHeaderIcon: addonCache.storage["settingsCommonDisplayHeaderIcon"] == true,
        displayTopLink: displayPositionValue == "-1" || displayPositionValue == "2",
        displayBottomLink: displayPositionValue == "1" || displayPositionValue == "2",
        displayHeaderIconButton: addonCache.storage["settingsCommonDisplayHeaderIconAsButton"] == true,
        displayCommentsOnMouseOver: addonCache.storage["settingsCommonMouseOverDisplay"] == true,
        displayLinkIconButton: addonCache.storage["settingsCommonDisplayLinkIconAsButton"] == true
      };

      contentWorker.port.emit("getControllerSettings", controllerSettings);
    });
  }
}

function optionsMessageCallback(message) {
  if(message.key == "getExchangeData") {
    optionsWorker.port.emit(message.key, { globals: globals, commonSettingsKeys: commonSettingsKeys, localizedMessages: localizedMessages });
  }
  else if(message.key == "setOptionValue") {
    addonCache.storage[message.optionKey] = message.optionValue;
  }
  else if(message.key == "setDefaultOptions") {
    setDefaultOptionValues();
    optionsWorker.port.emit(message.key);
  }
  else if(message.key == "getOptionValue") {
    optionsWorker.port.emit(message.key, { optionKey: message.optionKey, optionValue: addonCache.storage[message.optionKey] });
  }
  else if(message.key == "getOptionActiveMediaHeader") {
    optionsWorker.port.emit(message.key, { mediaHeader: getOptionActiveMediaHeader() });
  }
}