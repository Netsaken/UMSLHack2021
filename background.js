chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "FactCheck",
    title: "FactCheck!",
    contexts: ["selection"],
  });
});

function test1(info, tab) {
//https://github.com/mirmalis/TiktokE/blob/d5a0c255bef817a439083fd12f4a1859cbed7ecb/extension1/background.js

chrome.scripting.executeScript({target: { tabId: tab.id },files: ['./run.js']});
}

chrome.contextMenus.onClicked.addListener(test1);
