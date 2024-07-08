import { useEffect, useRef, useState } from 'react';
import { getCSRFToken } from '../api';

export const useCsrfToken = () => {
    const [csrftoken, setCsrfToken] = useState<string>('');
    const hasFetchedToken = useRef<boolean>(false);

    useEffect(() => {
        if (!hasFetchedToken.current) {
            getCSRFToken().then(token => {
                setCsrfToken(token);
                hasFetchedToken.current = true;
            }).catch(error => {
                console.error('Failed to fetch initial CSRF token:', error);
            });
        }
    }, []);

    return csrftoken;
};
