import { useEffect, useState } from 'react';
import { useApiData } from '../../hooks/useApi';
import { Paper, Title, Card, Flex, Text, Grid } from '@mantine/core';

const Stats = () => {
    const [data, setData] = useState<any>([]);
    const { data: apiData, loading, error } = useApiData(api.reports.recent);
    const hostItems = ['hosts_today', 'hosts_week', 'hosts_month'];
    const userItems = ['users_today', 'users_week', 'users_month'];
    const dnsItems = ['dns_today', 'dns_week', 'dns_month'];

    const itemText = (item: string) =>
        item.startsWith('hosts')
            ? item.replace(
                  'hosts_',
                  item.includes('today') ? 'Changed ' : 'Changed this ',
              )
            : item.startsWith('users')
              ? item.replace(
                    'users_',
                    item.includes('today') ? 'Joined ' : 'Joined this ',
                )
              : item.startsWith('dns')
                ? item.replace(
                      'dns_',
                      item.includes('today') ? 'Changed ' : 'Changed this ',
                  )
                : item;

    useEffect(() => {
        if (apiData) {
            setData(apiData);
        }
    }, [apiData]);

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Title mb="xs" order={1}>
                Recent Stats
            </Title>
            {loading && !error && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {data && (
                <Grid>
                    <Grid.Col span={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
                        <Card radius="md" p="md" m="xs" withBorder>
                            <Title mb="sm" order={2} size="h3">
                                Hosts
                            </Title>
                            {hostItems.map((item) => (
                                <Flex
                                    key={item}
                                    align="center"
                                    justify="space-between"
                                    mb="md"
                                >
                                    <Text>{itemText(item)}</Text>
                                    <Text fw={700} size="lg" c="blue">
                                        {data[item]}
                                    </Text>
                                </Flex>
                            ))}
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
                        <Card radius="md" p="md" m="xs" withBorder>
                            <Title mb="sm" order={2} size="h3">
                                Users
                            </Title>
                            {userItems.map((item) => (
                                <Flex
                                    key={item}
                                    align="center"
                                    justify="space-between"
                                    mb="md"
                                >
                                    <Text>{itemText(item)}</Text>
                                    <Text fw={700} size="lg" c="blue">
                                        {data[item]}
                                    </Text>
                                </Flex>
                            ))}
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ sm: 12, md: 4, lg: 4, xl: 4 }}>
                        <Card radius="md" p="md" m="xs" withBorder>
                            <Title mb="sm" order={2} size="h3">
                                DNS Records
                            </Title>
                            {dnsItems.map((item) => (
                                <Flex
                                    key={item}
                                    align="center"
                                    justify="space-between"
                                    mb="md"
                                >
                                    <Text>{itemText(item)}</Text>
                                    <Text fw={700} size="lg" c="blue">
                                        {data[item]}
                                    </Text>
                                </Flex>
                            ))}
                        </Card>
                    </Grid.Col>
                </Grid>
            )}
        </Paper>
    );
};

export default Stats;
