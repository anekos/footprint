
browser.contextMenus.create({
  id: 'footprint-remove',
  title: 'Remove',
  contexts: ['all'],
  documentUrlPatterns: [chrome.extension.getURL('*')],
  onclick: async (e) => {
    let targetUrl = e.linkUrl;
    let tabs = await browser.tabs.query({active: true, currentWindow: true});
    browser.tabs.sendMessage(tabs[0].id, {
      command: "footprint-remove",
      targetUrl:  targetUrl
    });
  }
});
