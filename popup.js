// popup.js

function getLinkedInSearchURL(name) {
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const namesList = document.getElementById('names-list');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    // Guard: block restricted Chrome pages
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      status.textContent = 'Cannot run on this page.';
      return;
    }

    chrome.scripting.executeScript(
      { target: { tabId: tabs[0].id }, files: ['content.js'] },
      () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getNames' }, (response) => {
          if (chrome.runtime.lastError) {
            status.textContent = 'Error: ' + chrome.runtime.lastError.message;
            return;
          }

          const names = response?.names || [];

          if (names.length === 0) {
            status.textContent = 'No names found on this page.';
            return;
          }

          status.textContent = `Found ${names.length} name(s):`;

          names.forEach(name => {
            const li = document.createElement('li');

            // Name text
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;

            // LinkedIn button
            const link = document.createElement('a');
            link.textContent = ' 🔗';
            link.title = 'Search on LinkedIn';
            link.style.cursor = 'pointer';
            link.style.textDecoration = 'none';

            // Use chrome.tabs.create instead of target="_blank"
            // because Chrome blocks _blank links from extension popups
            link.addEventListener('click', () => {
              chrome.tabs.create({ url: getLinkedInSearchURL(name) });
            });

            li.appendChild(nameSpan);
            li.appendChild(link);
            namesList.appendChild(li);
          });
        });
      }
    );
  });
});
