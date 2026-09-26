// Register synchronously so Chrome can wake the service worker for new tabs
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl !== "chrome://newtab/" || tab.id === undefined) {
    return;
  }

  chrome.tabs
    .update(tab.id, {
      url: chrome.runtime.getURL("index.html"),
    })
    .catch((error) => {
      console.warn("realNewTab could not replace the new tab.", error);
    });
});
