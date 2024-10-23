import React, { createContext, useContext, ReactNode } from 'react';
import AppConfig from '../config';

interface ConfigContextType {
    /**
     * Config object.
     */
    config: typeof AppConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * Hook to use the config object.
 * Throws an error if used outside of a ConfigProvider.
 */
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

interface ConfigProviderProps {
    config: typeof AppConfig;
    children: ReactNode;
}

/**
 * ConfigProvider component to wrap the application in. Provides the config object.
 */
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
    config,
    children,
}) => {
    return (
        <ConfigContext.Provider value={{ config }}>
            {children}
        </ConfigContext.Provider>
    );
};
