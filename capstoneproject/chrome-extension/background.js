chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in the background script:", message);
    
    if (message.type === 'CLEAR_CACHE') {
        // Clear cache logic
        chrome.browsingData.remove({
            "since": message.since
        }, {
            "cache": true,
            "cookies": true,
            "history": true
        }, () => {
            console.log("Cache, cookies, and history cleared successfully.");
            sendResponse({ success: true });
        });

        // Return true to indicate the response will be sent asynchronously
        return true;
    }
});
