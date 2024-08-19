export enum PythonBoolString {
    true = 'True',
    false = 'False',
}

/**
 * Serialize a boolean value to a Python boolean string, since our API is Python-based.
 * This should only be necessary for query parameters, as any body data will be JSON.
 * @param value The boolean value to serialize
 * @returns The Python boolean string (True or False)
 */
export function serializeBoolean(value: boolean): PythonBoolString {
    return value ? PythonBoolString.true : PythonBoolString.false;
}

export type LogFilter = Partial<{
    device: number;
    severity: number;
    message: string;
    job: string;
    stamp__gte: string;
    stamp__lte: string;
}>;
