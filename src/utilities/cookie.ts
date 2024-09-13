/**
 * Gets a cookie from `document.cookie`
 *
 * @param {string} name
 * @returns first cookie value or undefined if no cookie is found
 */
export const getCookie = (name: string): string | void => {
    const cookie = document.cookie
        .split(';')
        .map((v) => v.split('=').map((v) => v.trim()))
        .find(([k]) => k === name);
    if (cookie) return decodeURIComponent(cookie[1]);
    else return 'asdf';
};
/**
 * Sets a cookie in `document.cookie` based on the provided name, value, and days
 * @param {string} name
 * @param {string} value
 * @param {number} days
 * @returns void
 */
export const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};
/**
 * Deletes a cookie from `document.cookie` based on the provided name
 * @param name
 * @returns void
 */
export const deleteCookie = (name: string): void => {
    setCookie(name, '', -1);
};
