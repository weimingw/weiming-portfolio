export function getCurrentPath() {
    const currentUrl = new URL(window.location);
    return `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
}