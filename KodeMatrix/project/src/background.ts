// Background script for handling extension-wide state and communication
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

export {};