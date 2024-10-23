import { useState, useEffect } from 'react';
import { PaginatedData } from '../../types/api';
import { useApiData } from '../../hooks/useApi';
import { QueryRequest } from '../../utilities/apiFunctions';
import { formatHeader, formatDateLong } from '../../utilities/format';
import {
    Button,
    Paper,
    Title,
    Group,
    Loader,
    Text,
    Stack,
    Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface HostDetailViewProps {
    /**
     * Function to get the data for the host
     */
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    /**
     * Title of the detail view
     */
    title: string;
    /**
     * Whether the detail view is editable
     */
    editable?: boolean;
    /**
     * Modal component to edit the host
     */
    ModalComponent?: React.ComponentType<{ data: any; title: string }>;
}

const GENERAL_ATTR = ['hostname', 'mac', 'vendor', 'is_dynamic', 'description'];
const OWNER_ATTR = ['user_owners', 'group_owners'];
const DATES_ATTR = [
    'changed',
    // 'changed_by', //cant use this rn, its an object
    'expires',
    'last_seen',
    'last_seen_ip',
];

/**
 * Detail view for host object
 */
const HostDetailView = (props: HostDetailViewProps) => {
    const { getFunction, title, editable, ModalComponent } = props;
    const [data, setData] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const { data: apiData, loading } = useApiData(getFunction);

    const form = useForm({});

    useEffect(() => {
        if (apiData) {
            setData([apiData]);
        }
    }, [apiData]);

    useEffect(() => {
        form.setValues({
            hostname: data[0]?.hostname,
            mac: data[0]?.mac,
            is_dynamic: data[0]?.is_dynamic == true ? 'true' : 'false',
            description: data[0]?.description,
        });
    }, [data]);

    return (
        <Paper withBorder radius="lg" p="lg" m="lg">
            <Group justify="space-between">
                <Title order={1}>{title}</Title>
                {editable && (
                    <Button onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit'}
                    </Button>
                )}
            </Group>
            <Group>
                {loading ? (
                    <Loader />
                ) : editing ? (
                    ModalComponent ? (
                        <ModalComponent data={data} title={title} />
                    ) : (
                        <Text>No Modal Component</Text>
                    )
                ) : (
                    <>
                        {!loading && data.length !== 0 && (
                            <Group
                                justify="space-between"
                                align="flex-start"
                                mt="lg"
                            >
                                <Paper p="lg" radius="xl">
                                    <Stack>
                                        <Title order={2}>
                                            General Information
                                        </Title>
                                        <Divider />
                                        {GENERAL_ATTR.map((key) => (
                                            <Group justify="space-between">
                                                <Text
                                                    fw={600}
                                                    size="xl"
                                                    key={key}
                                                >
                                                    {formatHeader(key)}:{' '}
                                                </Text>
                                                <Text size="xl">
                                                    {data[0][key] !== null &&
                                                    data[0][key] !==
                                                        undefined &&
                                                    data[0][key] !== ''
                                                        ? typeof data[0][
                                                              key
                                                          ] === 'boolean'
                                                            ? data[0][key]
                                                                ? 'True'
                                                                : 'False'
                                                            : data[0][key]
                                                        : 'Unknown'}
                                                </Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Paper>
                                <Paper p="lg" radius="xl">
                                    <Stack>
                                        <Title order={2}>Owners</Title>
                                        <Divider />
                                        {OWNER_ATTR.map((key) => (
                                            <Group justify="space-between">
                                                <Text
                                                    fw={600}
                                                    size="xl"
                                                    key={key}
                                                >
                                                    {formatHeader(key)}:{' '}
                                                </Text>
                                                <Text size="xl">
                                                    {data[0][key] !== null &&
                                                    data[0][key] !==
                                                        undefined &&
                                                    data[0][key] !== ''
                                                        ? data[0][key]
                                                        : 'Unknown'}
                                                </Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Paper>
                                <Paper p="lg" radius="xl">
                                    <Stack>
                                        <Title order={2}>
                                            Record Status and Activity
                                        </Title>
                                        <Divider />
                                        {DATES_ATTR.map((key) => {
                                            const value = data[0][key];
                                            const dateRegex =
                                                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}:\d{2}|Z)?$/;
                                            const isDate =
                                                dateRegex.test(value);
                                            return (
                                                <Group
                                                    key={key}
                                                    justify="space-between"
                                                >
                                                    <Text fw={600} size="xl">
                                                        {formatHeader(key)}:{' '}
                                                    </Text>
                                                    <Text size="xl">
                                                        {value !== null &&
                                                        value !== undefined &&
                                                        value !== ''
                                                            ? isDate
                                                                ? formatDateLong(
                                                                      value,
                                                                  )
                                                                : value
                                                            : 'Unknown'}
                                                    </Text>
                                                </Group>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            </Group>
                        )}
                    </>
                )}
            </Group>
        </Paper>
    );
};

export default HostDetailView;
