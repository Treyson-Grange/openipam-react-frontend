export interface AppConfig {
    /**
     * URL of the API server
     */
    apiUrl: HostName;
    /**
     * Name of the organization
     */
    organizationName: string;
    // Add more configuration options here when needed.
}

type HostName = string & { readonly brand: unique symbol };

/**
 * Util function to check if a string is a valid hostname.
 * @param url
 * @returns whether the url is a valid hostname
 */
const isHostName = (url: string): url is HostName => {
    try {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const isLocalhost =
            (parsedUrl.protocol === 'http:' &&
                parsedUrl.hostname === '127.0.0.1') ||
            (parsedUrl.hostname === 'localhost' &&
                import.meta.env.VITE_DEVELOPMENT === 'true');
        return (isHttps || isLocalhost) && Boolean(parsedUrl.hostname);
    } catch {
        return false;
    }
};

/**
 * Util function to validate a hostname.
 * @param url
 * @returns hostname, checking if it is a valid hostname
 */
const validateHostName = (url: string): HostName => {
    if (isHostName(url)) {
        return url;
    }
    throw new Error(`Invalid host name: ${url}`);
};

const apiUrl = validateHostName(import.meta.env.VITE_API_URL as string);
const organizationName = import.meta.env.VITE_ORGANIZATION_NAME as string;
// Add more configuration options here

const config: AppConfig = {
    /**
     * URL of the API server
     */
    apiUrl,
    /**
     * Name of the organization
     */
    organizationName,
};

export default config;
