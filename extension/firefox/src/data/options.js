var exchangeDataKey = "getExchangeDataForOptions";
var exchangeData = null;

// Get exchange data
self.postMessage({ key: exchangeDataKey });

function initOptions() {
  // Set localized text messages
  document.getElementById("headerCommon").textContent = exchangeData.localizedMessages["settingsHeaderCommon"].message;
  document.getElementById("headerDisplay").textContent = exchangeData.localizedMessages["settingsHeaderDisplay"].message;
  document.getElementById("pageDisplayTop").textContent = exchangeData.localizedMessages["settingsDisplayTop"].message;
  document.getElementById("pageDisplayBoth").textContent = exchangeData.localizedMessages["settingsDisplayBoth"].message;
  document.getElementById("pageDisplayBottom").textContent = exchangeData.localizedMessages["settingsDisplayBottom"].message;
  document.getElementById("headerActiveMedia").textContent = exchangeData.localizedMessages["settingsHeaderMedia"].message;

  var globalsDataHTML = "";

  for(var i in exchangeData.globals.mediaData) {
    if(exchangeData.globals.mediaData[i].active) {
      globalsDataHTML += "<p><input type=\"checkbox\" id=\"" + exchangeData.globals.mediaData[i].id + "\" /><label for=\"" + exchangeData.globals.mediaData[i].id + "\"><img style=\"border: 0px; position: relative; top: 1px; left: 1px; height: 16px; width: 16px\" src=\"" + exchangeData.globals.mediaData[i].icon + "\" /></label><label for=\"" + exchangeData.globals.mediaData[i].id + "\" style=\"position: relative; top: -2px; left: 5px\">" + exchangeData.globals.mediaData[i].display + "</label></p>";
    }
  }

  document.getElementById("aciveMediaSources").innerHTML = globalsDataHTML;

  // Connect changed display position to function
  document.getElementById("topDisplay").onchange = saveDisplayChanged;
  document.getElementById("bothDisplay").onchange = saveDisplayChanged;
  document.getElementById("bottomDisplay").onchange = saveDisplayChanged;

  // Connect changed media sources to function
  for(var i in exchangeData.globals.mediaData) {
    if(exchangeData.globals.mediaData[i].active) {
      document.getElementById(exchangeData.globals.mediaData[i].id).onchange = saveCheckChanged;
    }
  }

  // Connect default button values
  document.getElementById("setDefault").onclick = setDefaultValues;
  document.getElementById("setDefault").value = " " + exchangeData.localizedMessages["settingsDefaultValues"].message + " ";

  // Set common setting values
  for(var i in exchangeData.commonSettingsKeys) {
    document.getElementById(exchangeData.commonSettingsKeys[i] + "Label").textContent = exchangeData.localizedMessages[exchangeData.commonSettingsKeys[i]].message;
    document.getElementById(exchangeData.commonSettingsKeys[i]).onchange = saveCheckChanged;
  }

  // Set logo image
  document.getElementById("logo").src = exchangeData.globals.server + "/" + exchangeData.globals.sourceRoot + "/img/logo.png";

  // Display stored option value
  displayOptionValues();

  // Start interval for monitoring active media header values
  monitorActiveMediaSources();
  window.setInterval(monitorActiveMediaSources, 500);
}

function monitorActiveMediaSources() {
  self.postMessage({ key: "getOptionActiveMediaHeader" });
}

function displayOptionValues() {
  // Common values
  for(var i in exchangeData.commonSettingsKeys) {
    self.postMessage({ key: "getOptionValue", optionKey: exchangeData.commonSettingsKeys[i] });
  }

  // Media values
  for(var i in exchangeData.globals.mediaData) {
    if(exchangeData.globals.mediaData[i].active) {
      self.postMessage({ key: "getOptionValue", optionKey: exchangeData.globals.mediaData[i].id });
    }
  }

  // Display values
  self.postMessage({ key: "getOptionValue", optionKey: "displayPosition" });
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

  self.postMessage({ key: "setOptionValue", optionKey: "displayPosition", optionValue: displayValue });
}

function saveCheckChanged(e) {
  self.postMessage({ key: "setOptionValue", optionKey: e.target.id, optionValue: e.target.checked });
}

function setDefaultValues() {
  // Set default values
  self.postMessage({ key: "setDefaultOptions" });
}

self.port.on(exchangeDataKey, function(message) {
  exchangeData = message;
  initOptions();
});

self.port.on("getOptionValue", function(message) {
  if(message.optionKey == "displayPosition") {
    // Display values
    var displayPositionValue = message.optionValue;

    if(displayPositionValue == -1) {
      document.getElementById("topDisplay").checked = true;
    }
    else if(displayPositionValue == 1) {
      document.getElementById("bottomDisplay").checked = true;
    }
    else if(displayPositionValue == 2) {
      document.getElementById("bothDisplay").checked = true;
    }
  }
  else {
    document.getElementById(message.optionKey).checked = message.optionValue;
  }
});

self.port.on("setDefaultOptions", function(message) {
  displayOptionValues();
});

self.port.on("getOptionActiveMediaHeader", function(message) {
  var activeDisplayMediaHeader = document.getElementById("headerActiveMedia").textContent;

  if(activeDisplayMediaHeader != message.mediaHeader && exchangeData) {
    document.getElementById("headerActiveMedia").textContent = message.mediaHeader;
  }
});