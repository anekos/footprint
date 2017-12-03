
browser.contextMenus.create({
  id: 'footprint-remove',
  title: 'Remove this target',
  contexts: ['link'],
  documentUrlPatterns: [chrome.extension.getURL('*')],
  onclick: async (e) => {
    let targetUrl = e.linkUrl;
    let name = e.linkText;
    Footprint.sendMessage({
      command: 'footprint-remove',
      targetUrl: targetUrl,
      name: name,
      confirmation: true,
    }, {active: true, currentWindow: true});
  }
});
