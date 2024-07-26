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

const LoginForm = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const api = getApiEndpointFunctions();
    const navigate = useNavigate();
    const { csrftoken } = useCsrfToken();

    const handleLogin = async () => {
        try {
            await api.auth.login({ username, password });
            navigate('/');
        } catch (error: any) {
            setError(`${error}`);
        }
    };

    return (
        <Container size='md' mt='xl'>
            <Paper radius='md' p='xl' withBorder >
                <Title order={1} mb='xl' ta='center'>Login</Title>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <Group>
                        <TextInput
                            label='Username'
                            placeholder='John Doe'
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                            required
                            size='lg'
                        />
                        <TextInput
                            type='password'
                            label='Password'
                            placeholder='Your password'
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            required
                            size='lg'
                        />
                        {error && <Text color='red' size='xl' mt='lg'>{error}</Text>}
                        <Button
                            type='submit'
                            radius='lg'
                            size='lg'
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
