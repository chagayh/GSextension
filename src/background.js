function handleMessage(request, sender, sendResponse) {
    if (request.background) {
        browser.tabs.create({
            url: request.nihLink, 
            active: false
        })
        browser.tabs.create({
            url: request.citedByLink, 
            active: false
        })
    }
}

browser.runtime.onMessage.addListener(handleMessage)
