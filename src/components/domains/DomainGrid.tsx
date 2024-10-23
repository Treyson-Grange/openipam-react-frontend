import { useState, useEffect } from 'react';
import { usePaginatedApi } from '../../hooks/useApi';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import { FaEye } from 'react-icons/fa';
import { useDebouncedValue } from '@mantine/hooks';
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
import { FaCircleXmark } from 'react-icons/fa6';

/**
 * Component to dynamically display a grid of domains.
 */
const DomainGrid = (): JSX.Element => {
    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);

    const [search, setSearch] = useState('');
    const [debounce] = useDebouncedValue(search, 200);

    const api = getApiEndpointFunctions();
    const { data } = usePaginatedApi(api.domain.get, page, PAGE_SIZE, {
        ...(debounce && { name: debounce }),
    });

    useEffect(() => {
        console.log(data);
        if (data?.count !== undefined) {
            setMaxPages(Math.ceil(data.count / PAGE_SIZE));
        }
    }, [data]);

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                <Group justify="space-between">
                    <Title>Your Domains</Title>
                    <TextInput
                        placeholder="Search Domains"
                        size="md"
                        radius="xl"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        aria-label="Search Domains"
                    />
                    <ActionIcon
                        variant="light"
                        size="xl"
                        radius="xl"
                        color="red"
                        onClick={() => setSearch('')}
                        aria-label="Clear Search"
                    >
                        <FaCircleXmark size={18} />
                    </ActionIcon>
                </Group>
                {data?.results?.length === 0 && <Title>No domains found</Title>}
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
