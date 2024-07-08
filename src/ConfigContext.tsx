import React, { createContext, useContext, ReactNode } from 'react';
import AppConfig from './config';

interface ConfigContextType {
    config: typeof AppConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

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

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ config, children }) => {
    return <ConfigContext.Provider value={{ config }}>{children}</ConfigContext.Provider>;
};
