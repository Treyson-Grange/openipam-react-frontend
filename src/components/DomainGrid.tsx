import { useState, useEffect } from 'react';
import { usePaginatedApi } from '../hooks/useApi';
import { useMediaQuery } from '@mantine/hooks';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import {
    Card,
    Text,
    Title,
    Grid,
    Paper,
    Badge,
    Group,
    ActionIcon,
    em,
    Pagination
} from '@mantine/core';
import { FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';


const DomainGrid = (): JSX.Element => {
    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(0);

    const api = getApiEndpointFunctions();
    const { data } = usePaginatedApi(
        api.domain.get,
        page,
        PAGE_SIZE
    );

    useEffect(() => {
        if (data?.count) {
            setMaxPages(Math.ceil(data.count / PAGE_SIZE));
        }
    }, [data]);

    const calculateSpan = () => {
        const isMobile = useMediaQuery(`(max-width: ${em(1100)})`);
        if (isMobile) {
            return 12;
        }
        return 3;
    };


    const span = calculateSpan();

    return (
        <Paper radius='lg' p='lg' m='lg' withBorder>
            <Group justify='space-between'>
                {data?.results?.length === 0 ? (
                    <Title order={1}>
                        No domains found
                    </Title>
                ) : (
                    <Title>Your Domains</Title>
                )}
                {maxPages !== 1 && (
                    <Pagination
                        total={maxPages}
                        value={page}
                        onChange={setPage}
                    />
                )}
            </Group>
            <Grid justify="flex-start" align="stretch" mt="lg">
                {data?.results?.map((domain: any, index: number) => (
                    <Grid.Col span={span} key={index}>
                        <Card radius="lg" h={"12rem"} shadow="xl" padding="lg">
                            <Group>
                                <Link to={`/domains/${domain.name}`} className='header-link'>
                                    <Title order={2} size="h3">{domain.name}</Title>
                                </Link>
                                <Badge color="blue" variant="light" size="lg">
                                    {domain.record_count}
                                </Badge>
                            </Group>
                            <Text size="md" c={"blue"} >
                                {domain.description}
                            </Text>
                            <Group
                                pos={"absolute"}
                                bottom={"10px"}
                                right={"10px"}
                            >
                                <Link to={`/domains/${domain.name}`} aria-label='View Records'>
                                    <ActionIcon
                                        variant="light"
                                        color="lightBlue"
                                        size="xl"
                                        radius="xl"
                                        aria-label='View Records'
                                    >
                                        <FaEye size={18} />
                                    </ActionIcon>
                                </Link>
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Paper>
    );
};

export default DomainGrid;
