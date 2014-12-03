var globals = null;
var matchingMediaId = null;
var matchingMediaTargetKey = null;
var matchingCheck = false;

// Get globals
chrome.runtime.sendMessage("globals", getGlobalsCallback);
     
function getGlobalsCallback(response) {
  globals = response;
  
  // Check matching media
  var locationUrl = new String(window.location);

  if(globals) {
    for(var i in globals.mediaData) {
      if(globals.mediaData[i].active && locationUrl.match(globals.mediaData[i].url)) {
        matchingMediaId = globals.mediaData[i].id;
        matchingMediaTargetKey = globals.mediaData[i].targetKey;
        break;
      }
    }
  }

  // Process matching media
  if(matchingMediaId) {
    // Check active media source
    chrome.runtime.sendMessage({ key: "getOptionValue", optionKey: matchingMediaId }, isMatchingMediaActiveCallback);
  }
}

function isMatchingMediaActiveCallback(response) {
  if(response.optionValue == "true" && !matchingCheck) {
    matchingCheck = true;
    injectScript(chrome.extension.getURL("jquery-2.1.1.min.js"), "jquery", jQueryInstalledCallback); 
  }
}

function jQueryInstalledCallback() {
  injectScript(globals.server + "/" + globals.sourceRoot + "/script/media/" + matchingMediaId + ".js", matchingMediaId, mediaScriptInstalled); 
}

function injectScript(src, id, injectionCallback) {
  if(!document.getElementById(id)) {
    // Prefix project key
    id = globals.projectKey + "-" + id;

    // Append the script
    var injectedScript = document.createElement("script");
    injectedScript.id = id;
    injectedScript.src = src + "?" + new Date().getTime();
    (document.head || document.documentElement).appendChild(injectedScript);
    injectedScript.addEventListener('load', injectionCallback);
  } 
}

function mediaScriptInstalled() {  
  // Inject controller script
  injectScript(globals.server + "/" + globals.sourceRoot + "/script/controller.js", "controller", controllerScriptInstalled);
}

function controllerScriptInstalled() {
  // Check matching media page
  var matchingMediaPageEvent = new CustomEvent("checkMatchingMedia");
  // Fire event and add listener
  document.addEventListener("reportMatchingMedia", matchingMediaPageFound);
  document.dispatchEvent(matchingMediaPageEvent);
}

function matchingMediaPageFound() {
  // Call global settings
  chrome.runtime.sendMessage({ key: "getControllerSettings", matchingMediaId: matchingMediaId, matchingMediaTargetKey: matchingMediaTargetKey }, globalSettingsCallback);
}

function globalSettingsCallback(response) {
  // Pass all settings and options values and start rendering
  var renderMediaPageEvent = new CustomEvent("initController", { "detail": response } );
  // Fire event
  document.dispatchEvent(renderMediaPageEvent);
}