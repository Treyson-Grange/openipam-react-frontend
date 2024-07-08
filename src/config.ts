export interface AppConfig {
    apiUrl: string;
    // Add others
}

const config: AppConfig = {
    apiUrl: import.meta.env.VITE_API_KEY as string,
    //Add others
};

export default config;
