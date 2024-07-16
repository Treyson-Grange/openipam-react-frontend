import { TextInput, Button, Text, Group, Container, Paper, Title } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { apiCall } from '../api';
import { useCsrfToken } from '../hooks/useCsrfToken';

const LoginForm = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();
    const { config } = useConfig();
    const { csrftoken, fetchCsrfToken } = useCsrfToken();

    const handleLogin = async () => {
        try {
            await fetchCsrfToken();
            const url = `${config.apiUrl}/login/`;
            const data = await apiCall(url, 'POST', { username, password }, csrftoken);
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
        <Container size="md" mt="xl">
            <Paper radius="md" p="xl" withBorder >
                <Title order={1} mb="xl" ta="center">Login</Title>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <Group>
                        <TextInput
                            label="Username"
                            placeholder="John Doe"
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                            required
                            size="lg"
                        />
                        <TextInput
                            type="password"
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            required
                            size="lg"
                        />
                        {error && <Text color="red" size="xl" mt="lg">{error}</Text>}
                        <Button
                            type="submit"
                            radius="lg"
                            size="lg"
                            fullWidth
                            disabled={!csrftoken}
                        >
                            Login
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginForm;
