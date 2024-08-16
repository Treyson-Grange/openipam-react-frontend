export interface AppConfig {
    apiUrl: HostName;
    frontendUrl: HostName;
    organizationName: string;
    // Add more configuration options here
}

type HostName = string & { readonly brand: unique symbol };

const isHostName = (url: string): url is HostName => {
    try {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const isLocalhost = parsedUrl.protocol === 'http:' && parsedUrl.hostname === '127.0.0.1' || parsedUrl.hostname === 'localhost' && import.meta.env.VITE_DEVELOPMENT === 'true';
        return (isHttps || isLocalhost) && Boolean(parsedUrl.hostname);
    } catch {
        return false;
    }
};

const validateHostName = (url: string): HostName => {
    if (isHostName(url)) {
        return url;
    }
    throw new Error(`Invalid host name: ${url}`);
};

const apiUrl = validateHostName(import.meta.env.VITE_API_URL as string);
const frontendUrl = validateHostName(import.meta.env.VITE_FRONTEND_URL as string);
const organizationName = import.meta.env.VITE_ORGANIZATION_NAME as string;
// Add more configuration options here

const config: AppConfig = {
    apiUrl,
    frontendUrl,
    organizationName,
};

export default config;
