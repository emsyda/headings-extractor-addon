function getBrowser() {
    if (typeof browser !== 'undefined') {
        return browser; // Firefox
    } else if (typeof chrome !== 'undefined') {
        return chrome; // Chrome or Edge
    } else {
        throw new Error('Unable to find browser API');
    }
}

// Get the content of the page, filter out the headings that were requested, and send them back to the popup script
getBrowser().runtime.onMessage.addListener((request, sender, sendResponse) => {
    let headings = [];
    for (let level of request) {
        let elements = document.getElementsByTagName(level);
        for (let elem of elements) {
            headings.push({
                level: level,
                text: elem.innerText,
                position: elem.getBoundingClientRect().top + window.pageYOffset,  // elem.offsetTop
            });
        }
    }
    headings.sort((a, b) => a.position - b.position);
    // browser.runtime.sendMessage(headings);
    sendResponse(headings); // Return the data to the popup script
    return true; // keep the messaging channel open for asynchronous response [CHROME ONLY]
});