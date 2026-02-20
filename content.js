function extractNames() {
  const names = new Set();

  // Target structural name elements only
  const nameSelectors = [
    '[itemprop="name"]',
    '[class*="name"]',
    '[class*="author"]',
    '[class*="person"]',
    '[class*="member"]',
    '[class*="leader"]',
    'h2',   // Works perfectly for the XP Power page
    'h3'
  ];

  nameSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText?.trim();
      // Only keep short strings (real names are never 60+ chars)
      if (text && text.length > 2 && text.length < 40) {
        names.add(text);
      }
    });
  });

  return [...names];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getNames') {
    sendResponse({ names: extractNames() });
  }
  return true;
});
