/**
 * format date to short format
 * @param date (2050-09-01T17:00:00-07:00)
 * @returns formatted date (Sep 1, 2050)
 */

export const formatDateShort = (date: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 * format date to long format
 * @param date (2050-09-01T17:00:00-07:00)
 * @returns formatted date (September 1, 2050 05:00 PM)
 */
export const formatDateLong = (date: string) => {
    const d = new Date(date);
    const optionsDate: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return `${d.toLocaleDateString('en-US', optionsDate)} ${d.toLocaleTimeString('en-US', optionsTime)}`;
};

/**
 * Capitalize the first letter of a word
 * @param word
 * @returns string with first letter capitalized
 */
export const capitalize = (word: string): string => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Remove underscores and dashes from a string and capitalize the first letter of each word
 * @param header
 * @returns formatted header
 */
export const formatHeader = (header: string) =>
    header
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase());
