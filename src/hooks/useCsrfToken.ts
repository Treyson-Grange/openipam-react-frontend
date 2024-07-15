import { useEffect, useRef, useState, useCallback } from 'react';
import { getCSRFToken } from '../api';
import { useConfig } from '../contexts/ConfigContext';

export const useCsrfToken = () => {
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);
    const { config } = useConfig();

    const fetchCsrfToken = useCallback(async () => {
        try {
            const tokens = await getCSRFToken(config.apiUrl);
            setCsrfToken(tokens.csrfToken);
            hasFetchedToken.current = true;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }, [config.apiUrl]);

    useEffect(() => {
        // if (!hasFetchedToken.current) {
        fetchCsrfToken();
        // }
    }, [fetchCsrfToken]);

    return { csrftoken, fetchCsrfToken };
};
