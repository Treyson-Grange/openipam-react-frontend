import { useEffect, useRef, useState, useCallback } from 'react';
import { getCSRFToken } from '../api';
import { useConfig } from '../contexts/ConfigContext';

const setCookie = (name: string, value: string, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

export const useCsrfToken = () => {
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);
    const { config } = useConfig();

    const fetchCsrfToken = useCallback(async () => {
        try {
            const tokens = await getCSRFToken(config.apiUrl);
            setCsrfToken(tokens.csrfToken);
            setCookie('csrftoken', tokens.csrfToken);
            hasFetchedToken.current = true;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }, [config.apiUrl]);

    useEffect(() => {
        fetchCsrfToken();
    }, [fetchCsrfToken]);

    return { csrftoken, fetchCsrfToken };
};
