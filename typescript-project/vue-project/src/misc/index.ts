export { decodeToken } from './token-decode';

/**
 * sleep function use to delay a process
 * @param ms
 * @returns
 */
export function sleep(ms: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

/**
 * generate randon hex number
 */
export function genRandHex(len: number): string {
    return [...Array(len)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')
        .toUpperCase();
}

/**
 * Debounce
 */
export function debounce(fn: Function, delay = 300) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(args), delay);
    };
}
