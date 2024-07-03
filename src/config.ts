export interface AppConfig {
    apiUrl: string;
    // Add other configuration properties here if needed
}

const config: AppConfig = {
    apiUrl: import.meta.env.VITE_API_KEY as string,
    // Define other properties as needed
};

export default config;
