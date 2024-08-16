import {
    TextInput,
    Button,
    Text,
    Group,
    Container,
    Paper,
    Title
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { useAuth } from '../contexts/AuthContext';
import { isUser } from '../utilities/typeGuards';

const LoginForm = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const api = getApiEndpointFunctions();
    const navigate = useNavigate();
    const { csrftoken, fetchCsrfToken } = useCsrfToken();
    const { setUser } = useAuth();

    /**
     * Handle login, and auth configuration if successful.
     */
    const handleLogin = async () => {
        try {
            const loginResponse = await api.auth.login({ username, password });
            await fetchCsrfToken();
            if (isUser(loginResponse)) {
                const userDetailsResponse = await api.auth.me();
                setUser({
                    ...loginResponse,
                    is_ipamadmin: userDetailsResponse.is_ipamadmin,
                    groups: userDetailsResponse.groups,
                    first_name: userDetailsResponse.first_name
                });

                navigate('/');
            } else {
                setError('Login failed: Invalid user data');
            }
        } catch (error: any) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <Container size="md" mt="xl">
            <Paper radius="md" p="xl" withBorder>
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
                        {error && <Text c="red" size="xl" mt="lg">{error}</Text>}
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
