import { API } from "../types";
import { serializeBoolean } from "../types/apiFilters";
import { getCookie } from "./getCookie";

/**
 * This is a hook that provides a simple interface for making requests to the
 * API.
 * Each function returned by this hook can throw two types of errors:
 * - `ApiError`: This error is thrown when the API returns a non-200 response.
 *  The `status` property of this error contains the status code returned by
 *  the API, and the `message` property contains any error message returned.
 * - `ApiResponseError`: This error is thrown when the API returns a 200
 *  response, but the response body is not what was expected. It contains the raw
 *  `Response` object returned by the `fetch` call. This can happen for, at
 *  minimum, any of the following reasons:
 *   - The response body is empty, but the request was expected to return data (e.g. not a 204 response)
 *   - The response body is not valid JSON, but the request was expected to return JSON
 *   - The response body is not valid text, but the request was expected to return text
 *
 * API calls which are expected to return a 204 response will have a return type of `void`.
 * However, as it is determined by the server whether or not to return a 204
 * response, it is possible for an API call to return a 204 response unexpectedly.
 * For this reason, it may be a good idea to check the result data for `undefined` before using it.
 * To enforce this, call this hook with a template parameter of `void`.
 */
export const getApiEndpointFunctions = <
    StrictTypeChecking extends void | never = never
>() => ({
    auth: {
        logout: requestGenerator<
            HttpMethod.POST,
            void,
            API.GenericResponse | StrictTypeChecking
        >(HttpMethod.POST, "logout/", { headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie("csrftoken") ?? "" } }),
    },
    logs: {
        get: requestGenerator<
            HttpMethod.GET,
            API.PaginationParams<API.Filters.LogFilter>,
            API.PaginatedData<API.LogEntry> | StrictTypeChecking
        >(HttpMethod.GET, "logs/", { headers: { "Content-Type": "application/json" } }),
    },
    reports: {
        recent: requestGenerator<
            HttpMethod.GET,
            Array<any>,
            API.RecentReport | StrictTypeChecking
        >(HttpMethod.GET, "report/recent-stats", { headers: { "Content-Type": "application/json" } }),
    }
});

declare global {
    var api: ReturnType<typeof getApiEndpointFunctions>;
}

const BASE_URL = "http://127.0.0.1:8000/api/v2";

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

export class ApiError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
    }
}

export class ApiResponseError extends ApiError {
    constructor(public readonly response: Response) {
        super(
            "API did not return a valid JSON response. See response property.",
            response.status
        );
    }
}

/**
 * JSON fields that the API uses to describe errors. Should check all of these
 * when attempting to parse an error response. The last field in this list
 * found in the response will be used as the error message.
 */
const ERROR_DESCRIPTION_FIELDS = ["detail"];

/**
 * Handles the response from the API.
 *
 * @param response The response from the API
 * @returns The parsed JSON response
 * @throws ApiError if the response is not ok
 * @throws ApiResponseError if the response is ok but the JSON is invalid
 */
async function handleResponse<ResultType>(
    response: Response,
    asText: boolean
): Promise<ResultType | undefined> {
    if (response.ok) {
        try {
            if (asText) {
                // @ts-ignore Accounted for by the `asText` parameter, and the template parameters
                // that chain back to this function are only accessible within this file
                return await response.text();
            } else {
                return await response.json();
            }
        } catch (e) {
            // Server returned a 200 but the response was not valid
            if (response.status === 204) {
                // If the response was supposed to be empty, return null
                return undefined;
            }
            throw new ApiResponseError(response.clone());
        }
    } else {
        return response.json().then(
            (data) => {
                const message = ERROR_DESCRIPTION_FIELDS.reduce(
                    (acc, field) => {
                        if (data[field]) {
                            return data[field];
                        }
                        return acc;
                    },
                    // Default to the status text if no error description fields were found
                    response.statusText
                );
                throw new ApiError(message, response.status);
            },
            () => {
                throw new ApiError(response.statusText, response.status);
            }
        );
    }
}

export type QueryRequest<ParamsType = any, ResponseType = any> = (
    params?: ParamsType,
    extraHeaders?: Record<string, string>,
    controller?: AbortController
) => Promise<ResponseType>;
export type DataRequest<DataType = any, ResponseType = any> = (
    data?: DataType,
    extraHeaders?: Record<string, string>,
    controller?: AbortController
) => Promise<ResponseType>;

/**
 * A request that can be memoized. This is the actual type returned by the
 * `requestGenerator` function, but it is not declared as such in order to
 * preserve syntax highlighting. It is only needed when memoizing the request
 * functions (e.g. in the `useApiData` hook). When doing so, cast the request
 * function to this type. This is a safe cast.
 */
export type MemoizableRequest = (QueryRequest | DataRequest) & {
    endpoint: string;
};

/**
 * Generates a function that can be used to make requests to a specific API endpoint.
 * @template Method The HTTP method to use for these requests. Required for type inference.
 * @template DataType The type of data that this request expects to receive in the request body, or as query parameters. Void if no data is expected.
 * @template ResponseType The type of data that this request returns in the response body when successful.
 * @param method The HTTP method to use for these requests. Should be the same as the Method template parameter.
 * @param url The URL to send the request to
 * @param extra Any additional options to pass to the request generator
 * @returns A function that can be used to make requests to the API with the given parameters
 */
function requestGenerator<
    Method extends HttpMethod,
    DataType = void,
    ResponseType = void
>(
    method: Method,
    url: string,
    extra: {
        /**
         * Any additional headers to send with these requests.
         */
        headers?: Record<string, string>;
        /**
         * The base URL to use for these requests. Defaults to `/api`.
         */
        base?: string;
        /**
         * Whether or not to parse the response as text instead of JSON.
         */
        text?: boolean;
        /**
         * Whether or not this request is form data.
         */
        form?: boolean;
        /**
         * Whether or not to return the raw response instead of parsing it.
         */
        raw?: boolean;
    } = {}
): Method extends HttpMethod.GET
    ? QueryRequest<DataType, ResponseType>
    : DataRequest<DataType, ResponseType> {
    const {
        headers = {},
        base = BASE_URL,
        text = false,
        form = false,
        raw = false,
    } = extra;
    url = `${base}/${url}`;
    switch (method) {
        case "GET":
            // TODO: add params type and update code that uses this
            /**
             * Call this API endpoint with the given query parameters.
             * @param params The query parameters to send in the request
             * @param extraHeaders Any additional headers to send in the request
             * @param controller An optional AbortController to use for the request
             * @returns The parsed JSON response
             * @throws ApiError if the response is not ok
             * @throws ApiResponseError if the response is ok but the JSON is invalid
             */
            const queryRequest = async (
                params?: DataType,
                extraHeaders: Record<string, string> = {},
                controller?: AbortController
            ) => {
                const newParams = Object.entries(params ?? {}).reduce(
                    (acc, [key, value]) => {
                        if (typeof value === "boolean") {
                            acc[key] = serializeBoolean(value);
                        } else {
                            // serialize undefined as None (null in Python)
                            acc[key] = String(value ?? "None");
                        }
                        return acc;
                    },
                    {} as Record<string, string>
                );
                const query = new URLSearchParams(newParams).toString();
                const response = await fetch(`${url}?${query}`, {
                    method,
                    headers: {
                        ...headers,
                        ...extraHeaders,
                    },
                    signal: controller?.signal,
                    credentials: "include",
                });
                // NOTE: the `any` type here does somewhat break type safety, but it's
                // necessary to allow the return type to vary based on the passed in
                // parameters. This is only used internally, so it's not a huge deal.
                // The main concern is an unexpected 204 response. If that happens, the
                // response will be null, which will trigger a type error if the
                // response is used as a non-nullable type. Any other empty response
                // will trigger an `ApiResponseError` in the `handleResponse` function,
                // which is expected behavior.
                if (raw) return response as any;
                return handleResponse<ResponseType>(response, text);
            };
            return Object.assign(queryRequest, { endpoint: url });
        default:
            /**
             * Call this API endpoint with the given data in the request body.
             * @param data The data to send in the request body
             * @param extraHeaders Any additional headers to send in the request
             * @param controller An optional AbortController to use for the request
             * @returns The parsed JSON response
             * @throws ApiError if the response is not ok
             * @throws ApiResponseError if the response is ok but the JSON is invalid
             */
            const dataRequest = async (
                data?: DataType,
                extraHeaders: Record<string, string> = {},
                controller?: AbortController
            ) => {
                const token = getCookie("csrftoken");
                if (token === undefined) {
                    throw new Error("CSRF token not found");
                }
                if (!form && !("Content-Type" in headers)) {
                    headers["Content-Type"] = "application/json";
                }
                const response = await fetch(url, {
                    method,
                    headers: {
                        ...headers,
                        ...extraHeaders,
                        // Add the CSRF token to the headers, overriding any value that
                        // might have been passed in the extra headers
                    },
                    signal: controller?.signal,
                    body: form ? (data as FormData) : JSON.stringify(data),
                    credentials: "include",
                });
                if (raw) return response as any;
                return handleResponse(response, text);
            };
            return Object.assign(dataRequest, { endpoint: url });
    }
}

window.api = getApiEndpointFunctions();
