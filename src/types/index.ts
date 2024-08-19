/**
 * Storable objects are objects that can be stored in the database. They can only
 * have string keys. Trying to enforce this at the type level causes a lot of
 * issues, namely the inability to use the `unknown` type in generic constraints.
 * This type is therefore used whenever we need to reference the keys of a storable
 * object.
 */
export type KeyofStorable<T> = string & keyof T;

export type Columns = {
    [key: string]: Column;
};

export type Column = {
    header?: string;
    baseWidth?: string;
    hidden?: boolean;
    tdClass?: string;
    filter?: {
        type: string;
        placeholder?: string;
        options?: string[];
        values?: string[];
        render?: ({
            params,
            negate,
            paramKey,
            setParam,
            delParam,
        }: {
            params: Params;
            negate: boolean;
            paramKey: string;
            setParam: Function | any;
            delParam: Function;
        }) => React.ReactNode;
    };
    orderable?: boolean;
    render?:
        | ((
              value: any,
              options?: any,
              list?: any,
              params?: Params,
          ) => React.ReactNode | string)
        | string;
    [key: string]: any;
};

export type Params = {
    page_size: number;
    page: number;
    ordering?: string;
    selected?: (string | number)[];
    [key: string]: any;
};

export type Filter = {
    name: string;
    params: Params;
    json_string: string;
    id: number;
};

export * as API from './api';
