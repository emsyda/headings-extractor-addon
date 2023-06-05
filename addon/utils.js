export function getBrowser() {
    console.log('getBrowser()', typeof browser, typeof chrome);
    if (typeof browser !== 'undefined') {
        return browser; // Firefox
    } else if (typeof chrome !== 'undefined') {
        return chrome; // Chrome or Edge
    } else {
        throw new Error('Unable to find browser API');
    }
}
