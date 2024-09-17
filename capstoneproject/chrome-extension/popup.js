document.getElementById('clearButton').addEventListener('click', () => {
    const oneHourAgo = (new Date()).getTime() - (60 * 60 * 1000);  // Set the time to one hour ago

    // Send a message to the background script to clear cache, cookies, and history
    chrome.runtime.sendMessage({
        type: 'CLEAR_CACHE',
        since: oneHourAgo
    }, (response) => {
        if (response && response.success) {
            alert("Cache, cookies, and history cleared successfully!");
        } else {
            alert("Failed to clear cache.");
        }
    });
});
