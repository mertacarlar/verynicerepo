// content.js

function extractNames() {
  const names = new Set();

  // Strategy 1: Elements with name-related attributes/classes
  const nameSelectors = [
    '[itemprop="name"]',
    '[class*="name"]',
    '[class*="author"]',
    '[class*="person"]',
    'h1', 'h2', 'h3'
  ];

  nameSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText?.trim();
      if (text && text.length < 60) names.add(text);
    });
  });

  // Strategy 2: Regex to find "Firstname Lastname" patterns in body text
  const bodyText = document.body.innerText || "";
  const nameRegex = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
  let match;
  while ((match = nameRegex.exec(bodyText)) !== null) {
    names.add(match[1]);
  }

  return [...names];
}

// Listen for a message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getNames") {
    sendResponse({ names: extractNames() });
  }
  return true; // keeps the channel open for async response
});
