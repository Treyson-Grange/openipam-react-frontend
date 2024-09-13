/**
 * format date to short format
 * @param date (2050-09-01T17:00:00-07:00)
 * @returns formatted date (Sep 1, 2050)
 */

export const formatDateShort = (date: string) => {
    console.log('date', date);
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
};

/**
 *
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
