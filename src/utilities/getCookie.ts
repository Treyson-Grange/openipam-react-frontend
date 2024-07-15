/**
 * Gets a cookie from `document.cookie`
 *
 * @param {string} name
 * @returns first cookie value or undefined if no cookie is found
 */
export const getCookie = (name: string): string | void => {
    const cookie = document.cookie
        .split(";")
        .map((v) => v.split("=").map((v) => v.trim()))
        .find(([k]) => k === name);
    if (cookie) return decodeURIComponent(cookie[1]);
    else return "asdf";
};

export const setCookie = (name: string, value: string, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}