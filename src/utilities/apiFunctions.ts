import { useToken } from "../hooks/useToken";

export const getApiEndpointFunctions = () => ({
    /**
     * Logs API
     */
    logs: {
        get: requestGenerator(HttpMethod.GET, "logs"),
        getEmails: requestGenerator(HttpMethod.GET, "logs/email"),
    },
})

const BASE_URL = import.meta.env.VITE_API_URL

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

function requestGenerator(method: string, url: string, base?: string) {
    url = `${base ?? BASE_URL}/${url}`;
    const token = useToken();
    switch (method) {
        case "GET":
            return async (params?: { [key: string]: any }) => {
                const query = new URLSearchParams(params ?? {}).toString();
                const response = await fetch(`${url}?${query}`);
                return response.json();
            };
        default:
            return async (data?: { [key: string]: any }) => {
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": token ?? "",
                    },
                    body: JSON.stringify(data ?? {}),
                });
                return response.json();
            };
    }
}
