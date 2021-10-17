// var popup = require("./run")

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "FactCheck",
    title: "FactCheck!",
    contexts: ["selection"],
  });
});

function test1(info, tab) {
//   const tabId = getTabId();
  chrome.tabs.create({
    url: "www.google.com?" + JSON.stringify(tab),
  });
//   try {
//     chrome.scripting.executeScript(
//       {
//         target: { tabId: tab.id },
//         func: () => {
//           console.log("Test");
//         },
//       },
//       () => {
//         chrome.tabs.create({
//           url: "popup.js",
//         });
//       }
//     );
//   } catch (e) {
//     chrome.tabs.create({
//       url: ".js" + info + tab,
//     });
//   }
}

chrome.contextMenus.onClicked.addListener(test1);
