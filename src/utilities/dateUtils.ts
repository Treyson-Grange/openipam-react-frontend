/**
 * A string representing a date in the ISO 8601 format.
 */
export type ISO8601String = `${number}-${number}-${number}T${number}:${number}${| `:${number}${`.${number}` | ""}`
    | ""}${"Z" | `${"+" | "-"}${number}:${number}`}`;

/**
 * A string representing a date in the ISO 8601 format in the UTC timezone. This is the same as the output of `Date.prototype.toISOString`.
 */
export type ISOUTCString = `${number}-${number}-${number}T${number}:${number}${| `:${number}${`.${number}` | ""}`
    | ""}Z`;

declare global {
    interface Date {
        /**
         * Returns a date as a string value in ISO 8601 format
         */
        toLocalISOString(): ISO8601String;

        /**
         * Returns a date as a string value in ISO 8601 format in the UTC timezone
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
         */
        toUTCISOString(): ISOUTCString;

        /**
         * Returns a date as a string value in ISO 8601 format in the UTC timezone
         * @deprecated Use `toLocalISOString` or `toUTCISOString` instead to be explicit about the intended timezone
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
         */
        toISOString(): ISOUTCString;
    }
}

Date.prototype.toLocalISOString = function () {
    const offset = this.getTimezoneOffset();
    const localTime = new Date(this.getTime() - offset * 60 * 1000);
    const hourOffset = Math.floor(Math.abs(offset) / 60);
    const minuteOffset = Math.abs(offset) % 60;

    const sign = offset < 0 ? "+" : "-";
    const hour = hourOffset.toString().padStart(2, "0");
    const minute = minuteOffset.toString().padStart(2, "0");
    return localTime
        .toUTCISOString()
        .replace("Z", `${sign}${hour}:${minute}`) as ISO8601String;
};

Date.prototype.toUTCISOString = Date.prototype.toISOString;
