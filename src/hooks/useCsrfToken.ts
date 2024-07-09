import { useEffect, useRef, useState } from 'react';
import { getCSRFToken } from '../api';
import { useConfig } from '../contexts/ConfigContext';

export const useCsrfToken = () => {
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);
    const { config } = useConfig();
    useEffect(() => {
        if (!hasFetchedToken.current) {
            getCSRFToken(config.apiUrl).then(token => {
                setCsrfToken(token);
                hasFetchedToken.current = true;
            }).catch(error => {
                console.error('Failed to fetch initial CSRF token:', error);
            });
        }
    }, []);

    return csrftoken;
};
