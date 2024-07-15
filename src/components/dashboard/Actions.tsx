import { useState, useEffect } from 'react';
import { Button, Text, Group, Container, Paper, Title, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { apiCall } from '../../api';
import { useCsrfToken } from '../../hooks/useCsrfToken';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import { usePaginatedApi } from '../../hooks/useApi';


const Actions = (): JSX.Element => {
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any>([]);
    const navigate = useNavigate();
    const { csrftoken, fetchCsrfToken } = useCsrfToken();
    const { config } = useConfig();
    const [userName, setUserName] = useState<string | null>(null);
    const api = getApiEndpointFunctions();

    const { data: paginatedData, loading, reload } = usePaginatedApi(api.logs.get, page, 5);

    useEffect(() => {
        if (paginatedData && paginatedData.results) {
            setData(paginatedData.results);
        }
    }, [paginatedData]);

    const nextPage = async () => {
        setPage(page + 1);
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
        <Container size="xl" mt="xl">
            <Paper radius="md" p="lg" withBorder>
                <Title order={1} >Recent Actions</Title>
                <Table>
                    <Table.Tbody>
                        {data && data.map((item: any) => {
                            const date = new Date(item.action_time);
                            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                            const formattedDate = date.toLocaleDateString('en-US', options);

                            return (
                                <Table.Tr key={item.id}>
                                    <Table.Td style={{ textAlign: 'left', textTransform: 'capitalize', minWidth: '200px', padding: '10px' }}>
                                        {item.content_type} {item.object_repr}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'right', minWidth: '150px', padding: '10px' }}>
                                        {formattedDate}
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </Paper>
        </Container>
    );


}

export default Actions; 