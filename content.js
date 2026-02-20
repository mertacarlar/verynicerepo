// content.js

// ─── LinkedIn Button Logic ────────────────────────────────────────────────────

function getLinkedInSearchURL(name) {
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`;
}

function createLinkedInButton(name) {
  const btn = document.createElement('a');
  btn.textContent = '🔗 LinkedIn';
  btn.href = getLinkedInSearchURL(name);
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.style.cssText = `
    display: inline-block;
    margin-left: 8px;
    padding: 2px 8px;
    background: #0a66c2;
    color: white !important;
    font-size: 12px;
    font-weight: bold;
    border-radius: 4px;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    font-family: sans-serif;
  `;
  return btn;
}

function injectButtonsIntoPage() {
  const nameSelectors = [
    '[itemprop="name"]',
    '[class*="name"]',
    '[class*="author"]',
    '[class*="person"]',
    '[class*="member"]',
    '[class*="leader"]',
    'h2',
    'h3'
  ];

  nameSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText?.trim();

      // Reuse the same length filter as extractNames
      if (!text || text.length <= 2 || text.length >= 40) return;

      // Skip if button already injected
      if (el.dataset.liInjected) return;
      el.dataset.liInjected = 'true';

      el.insertAdjacentElement('afterend', createLinkedInButton(text));
    });
  });
}

// ─── Your original extractNames (unchanged) ──────────────────────────────────

function extractNames() {
  const names = new Set();

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

// ─── Message listener (unchanged, buttons also injected on popup open) ────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getNames') {
    injectButtonsIntoPage();
    sendResponse({ names: extractNames() });
  }
  return true;
});

// Auto-inject buttons when page loads without needing the popup
injectButtonsIntoPage();
