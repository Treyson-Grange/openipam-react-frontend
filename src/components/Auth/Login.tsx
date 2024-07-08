// LoginForm.tsx
import { TextInput, Button, Text } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { apiCall } from '../../api';
import { useCsrfToken } from '../../hooks/useCsrfToken';

const LoginForm = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();
    const { config } = useConfig();
    const csrftoken = useCsrfToken();

    const handleLogin = async () => {
        try {
            const url = `${config.apiUrl}/login/`;
            const data = await apiCall(url, 'POST', { username, password }, csrftoken);
            console.log('Login successful:', data);
            navigate('/');
        } catch (error: any) {
            if (error.message === '401') {
                setError('Invalid credentials');
            } else if (error.message === '400') {
                setError('Bad request');
            }
        }
    };

    return (
        <>
            <TextInput
                label="Username"
                placeholder="John Doe"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
            />
            <TextInput
                mt="md"
                type="password"
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
            />
            {error && <Text color="red">{error}</Text>}
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={handleLogin}
                disabled={!csrftoken}
            >
                Login
            </Button>
        </>
    );
};

export default LoginForm;
