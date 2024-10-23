import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    DataRequest,
    MemoizableRequest,
    QueryRequest,
} from '../utilities/apiFunctions';
import { PaginatedData } from '../types/api';
import objectHash from 'object-hash';

/**
 * Determine if two query params are equal by comparing their keys and values.
 */
const queryParamsEqual = <T extends Record<string, string | number | boolean>>(
    a: T,
    b: T,
) => {
    return (
        Object.keys(a).every((key) => a[key] === b[key]) &&
        Object.keys(b).every((key) => a[key] === b[key])
    );
};

/**
 * A hook to memoize query parameters. This is useful for preventing unnecessary re-renders when the query parameters are the same.
 */
const useQueryParamsMemo = <
    T extends Record<string, string | number | boolean>,
>(
    queryParams: T,
) => {
    const [memo, setMemo] = useState(queryParams);
    // update memo if queryParams change
    if (!queryParamsEqual(queryParams, memo)) {
        setMemo(queryParams);
    }
    return memo;
};

/**
 * A hook to memoize the API endpoint. This is useful for preventing unnecessary re-renders when the endpoint is the same.
 */
const useApiEndpointMemo = (endpoint: MemoizableRequest) => {
    const [memo, setMemo] = useState(() => endpoint);
    if (endpoint.endpoint !== memo.endpoint) {
        setMemo(endpoint);
    }
    return memo;
};

/**
 * Fetch JSON data from a openIPAM API V2 endpoint with query parameters
 * @param endpoint
 * @param queryParams The optional query parameters to include in the requestThe API endpoint function to fetch data from
 * @param transform A function to transform the fetched data before returning it, called once after the request completes
 * @param makeRequest Whether to make requests or not
 * @returns The fetched data, null if the request has not completed
 */
export const useApiData = <
    Endpoint extends QueryRequest | DataRequest | null,
    Return = Awaited<ReturnType<Exclude<Endpoint, null>>>,
>(
    endpoint: Endpoint,
    queryParams?: Parameters<Endpoint extends null ? never : Endpoint>[0],
    transform: (
        data: Awaited<ReturnType<Endpoint extends null ? never : Endpoint>>,
    ) => Return = (data) => data,
    makeRequest: boolean = true,
):
    | {
          loading: false;
          data: Return;
          /**
           * The error that occurred while fetching the data, if any.
           */
          error: Error | undefined;
          /**
           * Perform an immediate reload of the data without modifying the query parameters.
           */
          reload: () => Promise<void>;
      }
    | {
          loading: true;
          data: undefined;
          /**
           * The error that occurred while fetching the data, if any.
           */
          error: Error | undefined;
          /**
           * Perform an immediate reload of the data without modifying the query parameters.
           */
          reload: () => Promise<void>;
      } => {
    const [data, setData] = useState<Return | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const memoizedQueryParams = useQueryParamsMemo(queryParams ?? {});
    const memoizedEndpoint = useApiEndpointMemo(
        (endpoint as MemoizableRequest) ?? {},
    );
    const controller = useRef<AbortController | null>(null);
    /**
     * Perform an immediate reload of the data without modifying the query parameters.
     * This is useful for refreshing the data after a mutation.
     */
    const reload = useCallback(async () => {
        if (!makeRequest) {
            return;
        }
        setLoading(true);
        if (controller.current) {
            controller.current.abort();
        }
        controller.current = new AbortController();
        if (endpoint === null) {
            setData(undefined);
            setLoading(false);
            return;
        }
        return memoizedEndpoint(memoizedQueryParams, {}, controller.current)
            .then(transform)
            .then(setData)
            .then(setLoading.bind(this, false))
            .catch((e) => {
                if (e instanceof DOMException && e.name === 'AbortError') {
                    // Request was aborted, ignore. We did this to ourselves.
                    return;
                }
                console.error(
                    `Failed to fetch data from ${memoizedEndpoint.endpoint}`,
                    e,
                );
                if (e instanceof Error) {
                    setError(e);
                }
                setData(undefined);
            })
            .finally(() => {
                controller.current = null;
            });
    }, [makeRequest, memoizedEndpoint, memoizedQueryParams, transform]);

    useEffect(() => {
        reload();
        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [memoizedEndpoint, memoizedQueryParams, makeRequest]);

    // @ts-expect-error data is always undefined when loading is true
    return {
        data,
        loading,
        error,
        reload: useCallback(reload, [memoizedEndpoint, memoizedQueryParams]),
    } as const;
};

/**
 * Fetch paginated JSON data from a openIPAM API V2 endpoint with query parameters
 * @param endpoint The API endpoint function to fetch data from
 * @param page The page number to fetch
 * @param pageSize The number of items per page
 * @param queryParams The optional query parameters to include in the request
 * @param transform A function to transform the fetched data before returning it, called once after the request completes
 * @returns The fetched data, undefined if the request has not completed
 */
export const usePaginatedApi = <
    Endpoint extends QueryRequest<any, PaginatedData<unknown>>,
    Return = Awaited<ReturnType<Endpoint>>,
>(
    endpoint: Endpoint,
    page: number,
    pageSize: number,
    queryParams?: Omit<Parameters<Endpoint>[0], 'page' | 'page_size'>,
    transform: (data: Awaited<ReturnType<Endpoint>>) => Return = (data) =>
        data as Return,
) => {
    const dataParams = useMemo(
        () => ({
            ...queryParams,
            page: page,
            page_size: pageSize,
        }),
        [page, pageSize, queryParams],
    );
    return useApiData(endpoint, dataParams, transform);
};

/**
 * Fetch JSON data from a openIPAM API V2 list endpoint and cache the results. Uses a LRU cache to store the last `cacheSize` pages.
 * @param endpoint The API endpoint function to fetch data from
 * @param prefetch How many pages to 'prefetch' (fetch in advance) when the page changes
 * @param page The page number to fetch
 * @param pageSize The number of items per page
 * @param queryParams The optional query parameters to include in the request
 * @param cacheSize The number of pages to cache in memory
 * @param transform A function to transform the fetched data before returning it, called once after the request completes
 * @returns The fetched data, undefined if the request has not completed
 */
export const useCachingApi = <
    Endpoint extends QueryRequest<any, PaginatedData<unknown>>,
    Return = Awaited<ReturnType<Endpoint>>,
>(
    endpoint: Endpoint,
    prefetch: number,
    page: number,
    pageSize: number,
    queryParams?: Omit<Parameters<Endpoint>[0], 'page' | 'page_size'>,
    cacheSize: number = 20,
    transform: (data: Awaited<ReturnType<Endpoint>>) => Return = (data) =>
        data as Return,
) => {
    const [data, setData] = useState<Return | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const memoizedQueryParams = useQueryParamsMemo(queryParams ?? {});
    const memoizedEndpoint = useApiEndpointMemo(
        endpoint as QueryRequest as MemoizableRequest,
    );
    const dataCache = useRef<Partial<Record<number, Return>>>({});
    const lastUsed = useRef<number[]>([]);
    const loadingPromises = useRef<Map<number, Promise<Return | undefined>>>(
        new Map(),
    );

    function cache(page: number, data: Return) {
        if (lastUsed.current.length > cacheSize) {
            delete dataCache.current[lastUsed.current.shift()!];
        }
        dataCache.current[page] = data;
        lastUsed.current = lastUsed.current.filter((p) => p !== page);
        lastUsed.current.push(page);
        return data;
    }

    useEffect(() => {
        // Update the last used list when the page changes
        lastUsed.current = lastUsed.current.filter((p) => p !== page);
        lastUsed.current.push(page);
    }, [page]);

    useEffect(() => {
        // Clear the cache if the endpoint or query params change, as these will invalidate the cache
        dataCache.current = {};
        lastUsed.current = [];
    }, [memoizedEndpoint, memoizedQueryParams, pageSize]);

    /**
     * Return the data for a given page, fetching it if necessary
     * @param page The page number to fetch
     * @returns The fetched data, undefined if the request has not completed
     */
    async function fetchPage(page: number) {
        if (page in dataCache.current) {
            // Return the data from the cache if it exists
            return dataCache.current[page];
        } else if (loadingPromises.current.has(page)) {
            // Return the promise if it is actively loading
            return loadingPromises.current.get(page);
        } else {
            // Fetch the data if it is not in the cache
            const promise = memoizedEndpoint({
                ...memoizedQueryParams,
                page: (page - 1) * pageSize,
                page_size: pageSize,
            })
                .then(transform)
                .then(cache.bind(undefined, page));
            loadingPromises.current.set(page, promise);
            return promise;
        }
    }

    function load() {
        console.log(
            'loading',
            page,
            pageSize,
            memoizedQueryParams,
            memoizedEndpoint,
        );
        const pagesToFetch = new Set<number>();
        for (let i = page + 1; i < page + prefetch; i++) {
            pagesToFetch.add(i);
        }
        if (page in dataCache.current) {
            // If the data is in the cache, set it immediately
            setData(dataCache.current[page]);
        } else if (loadingPromises.current.has(page)) {
            // If the data is actively being fetched, set loading to true and attach a then handler to set the data
            setLoading(true);
            loadingPromises.current
                .get(page)!
                .then(setData)
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Only set loading to true if we can't immediately produce the data from the cache
            // This prevents the loading spinner from flashing when the data is already in the cache
            setLoading(true);
            fetchPage(page).then((data) => {
                setData(data);
                setLoading(false);
            });
        }
        // Fetch the next pages in the background
        Promise.all(
            Array.from(pagesToFetch).map((page) => {
                const promise = fetchPage(page).finally(() => {
                    loadingPromises.current.delete(page);
                });
                loadingPromises.current.set(page, promise);
                return promise;
            }),
        ).finally(() => {
            // Just make sure that the currently-displayed page is the most recently used
            lastUsed.current = lastUsed.current.filter((p) => p !== page);
            lastUsed.current.push(page);
        });
    }

    useEffect(() => {
        load();
    }, [memoizedEndpoint, memoizedQueryParams, prefetch, page, pageSize]);

    type ReturnType = typeof loading extends true ? undefined : Return;

    return {
        /**
         * The fetched data, undefined if the request has not completed
         */
        data,
        /**
         * True if the data to be displayed is still loading, false otherwise
         */
        loading,
        /**
         * Perform an immediate reload of the data without modifying the query parameters. This also clears the cache.
         */
        reload: useCallback(() => {
            console.log('reloading');
            dataCache.current = {};
            lastUsed.current = [];
            load();
        }, [memoizedEndpoint, memoizedQueryParams, page, pageSize]),
    } as {
        data: ReturnType;
        loading: boolean;
        reload: () => void;
    };
};

/**
 * Fetch JSON data from a openIPAM API V2 endpoint and allow the user to edit it. The data will be saved back to the API when the user clicks 'Save'.
 * @param getEndpoint The API endpoint function to fetch data from. If null, the initial data object will be used instead.
 * @param setEndpoint The API endpoint function to save data to
 * @param initialData The initial data object to use if the fetch fails
 * @param queryArgs The optional query parameters to include in the request
 * @param transform A function to transform the fetched data before returning it, called once after the request completes. If the set endpoint
 * expects a different data type than the get endpoint, this function is required in order to transform the data to the expected type.
 * @returns
 */
export function useEditableData<
    GetEndpoint extends QueryRequest | null,
    SetEndpoint extends DataRequest<Return>,
    Return = GetEndpoint extends null
        ? Parameters<SetEndpoint>[0]
        : Awaited<ReturnType<Exclude<GetEndpoint, null>>>,
>(
    getEndpoint: GetEndpoint,
    setEndpoint: SetEndpoint,
    initialData: Return,
    queryArgs?: Parameters<GetEndpoint extends null ? never : GetEndpoint>[0],
    transform: (
        data: ReturnType<GetEndpoint extends null ? never : GetEndpoint>,
    ) => Return = (data) => data as Return,
): {
    /**
     * The current data object, including any changes made by the user
     */
    data: Return;
    /**
     * True if the data has been modified since the last save
     */
    modified: boolean;
    /**
     * A function to create a new update function for a specific field
     * @param field The field to update
     * @returns A function to update the field
     */
    update: (
        field: keyof Return,
    ) => Dispatch<SetStateAction<Return[keyof Return]>>;
    /**
     * Save the current data object to the API
     * @returns A promise that resolves when the data has been saved
     */
    save: () => Promise<void>;
    /**
     * Perform an immediate reload of the data without modifying the query parameters.
     * This will discard any unsaved changes.
     */
    reload: () => void;
    loading: boolean;
} {
    const {
        data: storedData,
        loading,
        reload,
    } = useApiData(getEndpoint, queryArgs, transform);
    const [data, setData] = useState<Return>(initialData);
    const [modified, setModified] = useState(false);

    useEffect(() => {
        setData(storedData ?? initialData);
        setModified(false);
    }, [storedData, objectHash(initialData ?? {})]);

    const update = useCallback(
        <Field extends keyof Return>(field: Field) =>
            (value: SetStateAction<Return[Field]>) => {
                setModified(true);
                setData((prev) => ({
                    ...prev,
                    [field]:
                        value instanceof Function ? value(prev[field]) : value,
                }));
            },
        [(setData as MemoizableRequest).endpoint],
    );

    const save = useCallback(async () => {
        // The server will ignore any extra fields in the data object, so this is a safe cast
        await setEndpoint(data);
        setModified(false);
    }, [data]);

    return { data, modified, update, save, reload, loading };
}
