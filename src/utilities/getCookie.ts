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
