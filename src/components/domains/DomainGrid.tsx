import { useState, useEffect } from 'react';
import { usePaginatedApi } from '../../hooks/useApi';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import { FaEye, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
    Card,
    Text,
    Title,
    Grid,
    Paper,
    Badge,
    Group,
    ActionIcon,
    Pagination,
    TextInput,
} from '@mantine/core';

const DomainGrid = (): JSX.Element => {
    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);

    const api = getApiEndpointFunctions();
    const { data } = usePaginatedApi(api.domain.get, page, PAGE_SIZE);

    useEffect(() => {
        if (data?.count) {
            setMaxPages(Math.ceil(data.count / PAGE_SIZE));
        }
    }, [data]);

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                {data?.results?.length === 0 ? (
                    <Title>No domains found</Title>
                ) : (
                    <Group justify="space-between">
                        <Title>Your Domains</Title>
                        <TextInput
                            placeholder="Search Domains"
                            radius="xl"
                            size="lg"
                            aria-label="Search Domains"
                        />
                        <ActionIcon
                            variant=""
                            size="xl"
                            onClick={() => {
                                console.log('Search clicked');
                            }}
                        >
                            <FaSearch />
                        </ActionIcon>
                    </Group>
                )}
                {maxPages !== 1 && (
                    <Pagination
                        total={maxPages}
                        value={page}
                        onChange={setPage}
                    />
                )}
            </Group>
            <Grid mt="lg" gutter="lg">
                {data?.results?.map((domain: any, index: number) => (
                    <Grid.Col
                        span={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}
                        key={index}
                    >
                        <Link
                            to={`/domains/${domain.name}`}
                            className="header-link"
                        >
                            <Card
                                radius="lg"
                                h="12rem"
                                shadow="xl"
                                padding="lg"
                            >
                                <Group>
                                    <Title order={2} size="h3">
                                        {domain.name}
                                    </Title>
                                    <Badge c="blue" variant="light" size="lg">
                                        {domain.record_count}
                                    </Badge>
                                </Group>
                                <Text size="md" c="blue">
                                    {domain.description}
                                </Text>
                                <Group
                                    pos="absolute"
                                    bottom="10px"
                                    right="10px"
                                >
                                    <ActionIcon
                                        variant="light"
                                        c="lightBlue"
                                        size="xl"
                                        radius="xl"
                                        aria-label="View Records"
                                    >
                                        <FaEye size={18} />
                                    </ActionIcon>
                                </Group>
                            </Card>
                        </Link>
                    </Grid.Col>
                ))}
            </Grid>
        </Paper>
    );
};

export default DomainGrid;
