// Register synchronously so Chrome can wake the service worker for new tabs.
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl !== "chrome://newtab/" || tab.id === undefined) {
    return;
  }

  // Use a direct extension URL so the replacement does not trigger this again.
  // Creating a replacement also avoids navigating the policy-controlled tab.
  void replaceNewTab(tab);
});

async function replaceNewTab(tab) {
  try {
    await chrome.tabs.create({
      url: chrome.runtime.getURL("index.html"),
      windowId: tab.windowId,
      index: tab.index,
      active: tab.active,
      pinned: tab.pinned,
    });
  } catch (error) {
    // Leave the original usable if Chrome cannot open the replacement.
    console.warn("realNewTab could not open a replacement tab.", error);
    return;
  }

  try {
    await chrome.tabs.remove(tab.id);
  } catch (error) {
    // The original may already have been closed by the user.
    console.warn("realNewTab could not close the original new tab.", error);
  }
}
