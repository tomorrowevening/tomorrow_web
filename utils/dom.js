export const isiPad = /iPad/i.test(navigator.userAgent);
export const isiPhone = /iPhone/i.test(navigator.userAgent);
export const isiOS = isiPad || isiPhone;
export const isChrome = /chrome/i.test(navigator.userAgent);
export const isSafari = /^((?!chrome).)*safari/i.test(navigator.userAgent);
export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
export const isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
export const isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) !== null;
export const hasUserMedia = (navigator.getUserMedia) !== undefined;
export const supportsWebp = (() => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
})();
export function delay(seconds) {
    return new Promise((resolve) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = undefined;
            resolve();
        }, seconds * 1000);
    });
}
export function fileName(path) {
    const slash = path.lastIndexOf('/') + 1;
    const period = path.lastIndexOf('.');
    return path.substring(slash, period);
}
export function guid() {
    return (Date.now() + Math.round(Math.random() * 99999)).toString();
}
