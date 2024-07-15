import { useEffect, useState } from 'react';
import { useApiData } from '../../hooks/useApi';
import { Container, Paper, Title } from '@mantine/core';

const Stats = () => {
    const [data, setData] = useState<any>([]);
    const { data: apiData, loading, error } = useApiData(api.reports.recent);
    const hostItems = ["hosts_today", "hosts_week", "hosts_month"];
    const userItems = ["users_today", "users_week", "users_month"];

    const itemText = (item: string) =>
        item.startsWith("hosts") ? item.replace("hosts_", item.includes("today") ? "Hosts changed " : "Hosts changed this ") :
            item.startsWith("users") ? item.replace("users_", item.includes("today") ? "Users joined " : "Users joined this ") :
                item;


    useEffect(() => {
        if (apiData) {
            setData(apiData);
        }
    }, [apiData]);

    return (
        <Container size="xl" mt="xl">
            <Paper radius="md" p="lg" withBorder>
                <Title order={1}>Stats</Title>

                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {data && (
                    <>
                        <Paper radius="md" p="md" m="md" withBorder>
                            <Title order={2}>Hosts</Title>
                            {hostItems.map((item) => (
                                <p key={item}>
                                    {itemText(item)}: {data[item]}
                                </p>
                            ))}
                        </Paper>
                        <Paper radius="md" p="md" m="md" withBorder>
                            <Title order={2}>Users</Title>
                            {userItems.map((item) => (
                                <p key={item}>
                                    {data[item]} {itemText(item)}
                                </p>
                            ))}
                        </Paper>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Stats;