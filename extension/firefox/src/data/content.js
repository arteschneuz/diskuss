var exchangeDataKey = "getExchangeData";
var exchangeData = null;
var matchingMediaId = null;
var matchingMediaTargetKey = null;
var matchingCheck = false;

// Get exchange data
self.port.emit(exchangeDataKey);

self.port.on(exchangeDataKey, function(message) {
  exchangeData = message;
  getGlobalsCallback();
});

function getGlobalsCallback() {
  // Check matching media
  var locationUrl = new String(window.location);

  if(exchangeData) {
    for(var i in exchangeData.globals.mediaData) {
      if(exchangeData.globals.mediaData[i].active && locationUrl.match(exchangeData.globals.mediaData[i].url)) {
        matchingMediaId = exchangeData.globals.mediaData[i].id;
        matchingMediaTargetKey = exchangeData.globals.mediaData[i].targetKey;
        break;
      }
    }
  }

  // Process matching media
  if(matchingMediaId) {
    // Check active media source by user
    self.port.emit("getOptionValue", { optionKey: matchingMediaId });
  }
}

function injectScript(src, id, injectionCallback) {
  if(!document.getElementById(id)) {
    // Prefix project key
    id = exchangeData.globals.projectKey + "-" + id;

    // Append the script
    var injectedScript = document.createElement("script");
    injectedScript.id = id;
    injectedScript.src = src + "?" + new Date().getTime();
    (document.head || document.documentElement).appendChild(injectedScript);
    injectedScript.addEventListener('load', injectionCallback);
  }
}

self.port.on("getOptionValue", function(message) {
  if(message.optionValue && !matchingCheck) {
    matchingCheck = true;
    injectScript(exchangeData.selfData + "jquery-2.1.1.min.js", "jquery", jQueryInstalledCallback);
  }
});

function jQueryInstalledCallback() {
  // Inject media script
  injectScript(exchangeData.globals.server + "/" + exchangeData.globals.sourceRoot + "/script/media/" + matchingMediaId + ".js", matchingMediaId, mediaScriptInstalled);
}

function mediaScriptInstalled() {
  // Inject controller script
  injectScript(exchangeData.globals.server + "/" + exchangeData.globals.sourceRoot + "/script/controller.js", "controller", controllerScriptInstalled);
}

function controllerScriptInstalled() {
  // Check matching media page
  var matchingMediaPageEvent = new CustomEvent("checkMatchingMedia");
  // Fire event and add listener
  document.addEventListener("reportMatchingMedia", matchingMediaPageFound);
  document.dispatchEvent(matchingMediaPageEvent);
}

function matchingMediaPageFound() {
  // Assemble controller settings
  self.port.emit("getControllerSettings", { matchingMediaId: matchingMediaId, matchingMediaTargetKey: matchingMediaTargetKey });
}

self.port.on("getControllerSettings", function(settings) {
  // Hello SDK developer, why do I have to do this?
  var clone = cloneInto(settings, document.defaultView);
  // Pass all settings and options values and start rendering
  var renderMediaPageEvent = new CustomEvent("initController", { "detail": clone });
  // Fire event
  document.dispatchEvent(renderMediaPageEvent);
});