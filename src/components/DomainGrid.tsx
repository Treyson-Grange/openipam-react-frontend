import { usePaginatedApi } from '../hooks/useApi';
import { useMediaQuery } from '@mantine/hooks';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { Card, Text, Title, Grid, Paper, Badge, Group, ActionIcon, em } from '@mantine/core';
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';

const DomainGrid = (): JSX.Element => {
    const PAGE = 1;
    const PAGE_SIZE = 12;

    const api = getApiEndpointFunctions();
    const { data } = usePaginatedApi(
        api.domain.get,
        PAGE,
        PAGE_SIZE,
    );

    const calculateSpan = (count: number) => {//not even close to being complete or correct
        const isMobile = useMediaQuery(`(max-width: ${em(900)})`);
        if (isMobile) {
            return 12;
        }
        if (count > 12) return 4;
        if (count > 6) return 3;
        if (count > 3) return 4;
        return 3;
    }

    const count = data?.count || 0;
    const span = calculateSpan(count);

    return (
        <Paper radius='lg' p='lg' m='lg' withBorder>
            <Title>Your Domains</Title>
            <Grid justify="flex-start" align="stretch" mt="lg">
                {data?.results?.map((domain: any, index: number) => (
                    <Grid.Col span={span} key={index}>
                        <Card style={{ minHeight: "12rem", position: "relative" }} shadow="sm" padding="lg">
                            <Group>
                                <Title order={2} size="h4">{domain.name}</Title>
                                <Badge color="blue" variant="light" size="lg">
                                    {domain.record_count}
                                </Badge>
                            </Group>
                            <Text size="sm" color="dimmed">
                                {domain.description}
                            </Text>
                            <Group
                                style={{ position: "absolute", bottom: "10px", right: "10px" }}
                            >
                                <Link to={`/domains/${domain.name}`}>
                                    <ActionIcon
                                        variant="light"
                                        color="lightBlue"
                                        size="xl"
                                        radius="xl"
                                    >
                                        <FaEye size={18} />
                                    </ActionIcon>
                                </Link>
                                <ActionIcon
                                    variant="light"
                                    color="blue"
                                    size="xl"
                                    radius="xl"
                                >
                                    <FaPencilAlt size={18} />
                                </ActionIcon>
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Paper>
    );
}

export default DomainGrid;
