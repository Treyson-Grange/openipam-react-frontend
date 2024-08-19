import { useEffect, useRef, useState, useCallback } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const setCookie = (name: string, value: string, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export const useCsrfToken = () => {
    const api = getApiEndpointFunctions();
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);
    const { config } = useConfig();

    const fetchCsrfToken = useCallback(async () => {
        try {
            const csrfCall = await api.auth.getCSRFToken();
            setCsrfToken(csrfCall.csrfToken);
            setCookie('csrftoken', csrfCall.csrfToken);
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
