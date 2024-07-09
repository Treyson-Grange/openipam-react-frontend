import { useState, useEffect } from 'react';
import { Button, Text, Group, Container, Paper, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { apiCall } from '../api';
import { useCsrfToken } from '../hooks/useCsrfToken';

const Home = (): JSX.Element => {
    const navigate = useNavigate();
    const { config } = useConfig();
    const csrftoken = useCsrfToken();
    const [userName, setUserName] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const url = `${config.apiUrl}/logout/`;
            const data = await apiCall(url, 'POST', null, csrftoken);
            console.log(data);
            navigate('/login')
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleWhoAmI = async () => {
        try {
            const url = `${config.apiUrl}/whoami/`;
            const data = await apiCall(url, 'GET', null, csrftoken);
            if (data.user === null) {
                navigate('/login')
                return;
            }
            setUserName(data.user.username);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        handleWhoAmI();
    }, []);

    return (
        <>
            <Container size="md" mt="xl">
                <Paper radius="md" p="xl" withBorder>
                    <Title order={1} mb="xl" ta="center">Home</Title>
                    <Text size="xl" ta="center">Welcome, {userName}</Text>
                    <Group flex="row" justify="space-between" mt="xl">
                        <Button
                            onClick={handleLogout}
                            radius="lg"
                            size="lg"
                            fullWidth
                        >
                            Logout
                        </Button>
                    </Group>
                </Paper>
            </Container>
        </>

    );
};

export default Home;
