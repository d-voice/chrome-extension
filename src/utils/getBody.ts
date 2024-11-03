export function getCurrentBody() {
    return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        return tabs[0].title;
    })
}