import { TextInput, Button } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../ConfigContext';


async function getCSRFToken(): Promise<string> {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v2/get_csrf/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

async function apiCall(url: string, method: string, body: Record<string, any> | null, csrftoken: string): Promise<any> {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : null
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const Home = (): JSX.Element => {
    const hasFetchedToken = useRef<boolean>(false);
    const [csrftoken, setCsrfToken] = useState<string>('');
    const navigate = useNavigate();
    const { config } = useConfig();
    console.log('Config:', config.apiUrl);

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

    const handleLogin = async (username: string, password: string) => {
        try {
            const url = `${config.apiUrl}/login/`;
            const data = await apiCall(url, 'POST', { username, password }, csrftoken);
            console.log('Login successful:', data);
            navigate('/');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const url = `${config.apiUrl}/logout/`;
            const data = await apiCall(url, 'POST', null, csrftoken);
            console.log(data);
            navigate('/login')
            // Handle successful logout
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleWhoAmI = async () => {
        try {
            const url = `${config.apiUrl}/whoami/`;
            const data = await apiCall(url, 'GET', null, csrftoken);
            console.log(data);
            // Handle successful response
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <>
            <div>Home</div>
            <TextInput label="Username" placeholder="John Doe" />
            <TextInput
                mt="md"
                type="password"
                label="Password"
                placeholder="Your password"
            />
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={() => handleLogin('treyson', 'asdf')}
                disabled={!csrftoken}
            >
                Login
            </Button>
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={handleLogout}
                disabled={!csrftoken}
            >
                Logout
            </Button>
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={handleWhoAmI}
                disabled={!csrftoken}
            >
                Who Am I
            </Button>
        </>
    );
};

export default Home;
