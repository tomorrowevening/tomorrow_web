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

/**
 * Delays the call in X-seconds
 * @param seconds In seconds
 * @returns A Promise once the delay is complete
 */
export function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    let timer: any = setTimeout(() => {
      clearTimeout(timer);
      timer = undefined;
      resolve();
    }, seconds * 1000);
  });
}

/**
 * Strips apart the string to retrieve a file name without the file extension
 * @param path The URL
 * @returns The file name
 */
export function fileName(path: string): string {
  const slash = path.lastIndexOf('/') + 1;
  const period = path.lastIndexOf('.');
  return path.substring(slash, period);
}

/**
 * A generated unique ID
 * @returns A unique ID
 */
export function guid(): string {
  return (Date.now() + Math.round(Math.random() * 99999)).toString();
}