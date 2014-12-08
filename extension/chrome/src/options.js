window.addEventListener("load", initOptionsPage);
var commonSettingsKeys = null;
var globalsKey = "globals";

function initOptionsPage() {
  chrome.runtime.sendMessage({ key: "getCommonSettingsKeys" }, initCommonSettingsKeysCallback);
}

function initCommonSettingsKeysCallback(response) {
  commonSettingsKeys = response.keys;

  if(commonSettingsKeys != null) {
    initOptions();
  }
}

function monitorActiveMediaSources() { 
  chrome.runtime.sendMessage({ key: "getActiveMediaHeader" }, function(activeMediaHeader) {
    var activeDisplayMediaHeader = document.getElementById("headerActiveMedia").innerText;

    if(activeDisplayMediaHeader != activeMediaHeader) {
      document.getElementById("headerActiveMedia").innerText = activeMediaHeader;
    }
  });
}

function initOptions() {
  // Set localized text messages
  document.getElementById("headerCommon").innerText = chrome.i18n.getMessage("settingsHeaderCommon");
  document.getElementById("headerDisplay").innerText = chrome.i18n.getMessage("settingsHeaderDisplay");
  document.getElementById("pageDisplayTop").innerText = chrome.i18n.getMessage("settingsDisplayTop");
  document.getElementById("pageDisplayBoth").innerText = chrome.i18n.getMessage("settingsDisplayBoth");
  document.getElementById("pageDisplayBottom").innerText = chrome.i18n.getMessage("settingsDisplayBottom");
  document.getElementById("headerActiveMedia").innerText = chrome.i18n.getMessage("settingsHeaderMedia");

  chrome.runtime.sendMessage(globalsKey, function(globals) {
    // Display all supported media
    if(globals) {
      var globalsDataHTML = "";
 
      for(var i in globals.mediaData) {
        if(globals.mediaData[i].active) {
          globalsDataHTML += "<p><input type=\"checkbox\" id=\"" + globals.mediaData[i].id + "\" /><label for=\"" + globals.mediaData[i].id + "\"><img style=\"border: 0px; position: relative; top: 1px; left: 1px; height: 16px; width: 16px\" src=\"" + globals.mediaData[i].icon + "\" /></label><label for=\"" + globals.mediaData[i].id + "\" style=\"position: relative; top: -2px; left: 5px\">" + globals.mediaData[i].display + "</label></p>";
        }
      }

      document.getElementById("aciveMediaSources").innerHTML = globalsDataHTML;

      // Connect changed display position to function
      document.getElementById("topDisplay").onchange = saveDisplayChanged;
      document.getElementById("bothDisplay").onchange = saveDisplayChanged;
      document.getElementById("bottomDisplay").onchange = saveDisplayChanged;

      // Connect changed media sources to function
      for(var i in globals.mediaData) {
        if(globals.mediaData[i].active) {
          document.getElementById(globals.mediaData[i].id).onchange = saveCheckChanged;
        }
      }

      // Connect default button values
      document.getElementById("setDefault").onclick = setDefaultValues;
      document.getElementById("setDefault").value = " " + chrome.i18n.getMessage("settingsDefaultValues") + " ";

      // Set common setting values
      for(var i in commonSettingsKeys) {
        document.getElementById(commonSettingsKeys[i] + "Label").innerText = chrome.i18n.getMessage(commonSettingsKeys[i]);
        document.getElementById(commonSettingsKeys[i]).onchange = saveCheckChanged;
      }

      // Set logo image
      document.getElementById("logo").src = globals.server + "/" + globals.sourceRoot + "/img/logo.png";

      // Display stored option value
      displayOptionValues();

      // Start interval for monitoring active media header values
      monitorActiveMediaSources();
      window.setInterval(monitorActiveMediaSources, 500);
    }
  });
}

function displayOptionValues() {
  // Common values
  for(var i in commonSettingsKeys) {    
    chrome.runtime.sendMessage({ key: "getOptionValue", optionKey: commonSettingsKeys[i] }, setOptionValueCallback);
  }

  // Media values
  chrome.runtime.sendMessage(globalsKey, function(globals) {
    if(globals) {
      for(var i in globals.mediaData) {
        if(exchangeData.globals.mediaData[i].active) {
          chrome.runtime.sendMessage({ key: "getOptionValue", optionKey: globals.mediaData[i].id }, setOptionValueCallback);
        }
      }
    }
  });

  // Display values
  chrome.runtime.sendMessage({ key: "getOptionValue", optionKey: "displayPosition" }, setOptionValueCallback);
}


function setOptionValueCallback(response) {
  if(response.key == "displayPosition") {
    // Display values
    var displayPositionValue = response.optionValue;

    if(displayPositionValue == "-1") {
      document.getElementById("topDisplay").checked = true;
    }
    else if(displayPositionValue == "1") {
      document.getElementById("bottomDisplay").checked = true;
    }
    else if(displayPositionValue == "2") {
      document.getElementById("bothDisplay").checked = true;
    }
  }
  else {
    document.getElementById(response.key).checked = response.optionValue == "true";
  }
}

function saveDisplayChanged(e) {
  var displayValue = null;

  if(e.target.id == "topDisplay") {
    displayValue = -1;
  }
  else if(e.target.id == "bothDisplay") {
    displayValue = 2;
  }
  else if(e.target.id == "bottomDisplay") {
    displayValue = 1;
  }

  chrome.runtime.sendMessage({ key: "setOptionValue", optionKey: "displayPosition", optionValue: displayValue });
}

function saveCheckChanged(e) {
  chrome.runtime.sendMessage({ key: "setOptionValue", optionKey: e.target.id, optionValue: e.target.checked });
}

function setDefaultValues() {
  // Set default values
  chrome.runtime.sendMessage({ key: "setDefaultOptions" }, displayOptionValues);
}