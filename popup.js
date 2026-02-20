// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const namesList = document.getElementById('names-list');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    // Step 1: Inject the content script manually first
    chrome.scripting.executeScript(
      { target: { tabId }, files: ['content.js'] },
      () => {
        // Step 2: THEN send the message
        chrome.tabs.sendMessage(tabId, { action: 'getNames' }, (response) => {
          if (chrome.runtime.lastError) {
            status.textContent = 'Error: ' + chrome.runtime.lastError.message;
            return;
          }
          const names = response?.names || [];
          status.textContent = `Found ${names.length} name(s):`;
          names.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            namesList.appendChild(li);
          });
        });
      }
    );
  });
});
