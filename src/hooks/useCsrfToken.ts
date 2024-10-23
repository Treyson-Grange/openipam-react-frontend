import { useEffect, useRef, useState, useCallback } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { setCookie } from '../utilities/cookie';

/**
 * Hook to fetch and store CSRF token, providing a function to fetch a new token.
 */
export const useCsrfToken = () => {
    const api = getApiEndpointFunctions();
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);
    const { config } = useConfig();

    const fetchCsrfToken = useCallback(async () => {
        try {
            const csrfCall = await api.auth.getCSRFToken();
            setCsrfToken(csrfCall.csrfToken);
            setCookie('csrftoken', csrfCall.csrfToken, 1);
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
