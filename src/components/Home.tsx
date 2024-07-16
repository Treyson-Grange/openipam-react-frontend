import { useState, useEffect } from 'react';
import { Button, Text, Group, Container, Paper, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { apiCall } from '../api';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { usePaginatedApi } from '../hooks/useApi';

const Home = (): JSX.Element => {
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any>([]);
    const navigate = useNavigate();
    const { config } = useConfig();
    const { csrftoken, fetchCsrfToken } = useCsrfToken();
    const [userName, setUserName] = useState<string | null>(null);
    const api = getApiEndpointFunctions();

    const { data: paginatedData } = usePaginatedApi(api.logs.get, page, 5);

    useEffect(() => {
        if (paginatedData && paginatedData.results) {
            setData(paginatedData.results);
        }
    }, [paginatedData]);

    const nextPage = async () => {
        setPage(page + 1);
    };

    // function updateCSRFToken(newToken: string) {
    //     const csrfCookieName = 'csrftoken';
    //     const currentToken = getCookie(csrfCookieName);

    //     if (currentToken !== newToken) {
    //         setCookie(csrfCookieName, newToken);
    //     }
    // }

    // const logout = useCallback(async () => {
    //     await fetchCsrfToken();
    //     updateCSRFToken(csrftoken);
    //     await api.auth.logout();
    //     await reload();
    // }, [reload]);



    const handleLogout = async () => {
        try {
            await fetchCsrfToken();
            const url = `${config.apiUrl}/logout/`;
            await apiCall(url, 'POST', null, csrftoken);
            navigate('/login');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleWhoAmI = async () => {
        try {
            const url = `${config.apiUrl}/whoami/`;
            const data = await apiCall(url, 'GET', null, csrftoken);
            if (data.user === null) {
                navigate('/login');
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
                    <Button
                        onClick={nextPage}
                        radius="lg"
                        size="lg"
                        fullWidth
                    >
                        nextpage
                    </Button>
                    {data && data.map((item: any) => (
                        <div key={item.id}>
                            <Text size="md" ta="center">ID: {item.id}</Text>
                            <Text size="md" ta="center">Content Type: {item.content_type}</Text>
                            <Text size="md" ta="center">Action Flag: {item.action_flag}</Text>
                            <Text size="md" ta="center">Action Time: {item.action_time}</Text>
                            <Text size="md" ta="center">Object ID: {item.object_id}</Text>
                            <Text size="md" ta="center">Object Repr: {item.object_repr}</Text>
                            <Text size="md" ta="center">Change Message: {item.change_message}</Text>
                            <Text size="md" ta="center">User: {item.user}</Text>
                        </div>
                    ))}

                </Group>
            </Paper>
        </Container>
    );
};

export default Home;
