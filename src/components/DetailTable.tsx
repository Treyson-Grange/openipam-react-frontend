import { useState, useEffect } from 'react';
import { PaginatedData } from '../types/api';
import { useApiData } from '../hooks/useApi';
import { QueryRequest } from '../utilities/apiFunctions';
import {
    Button,
    Paper,
    Title,
    Table,
    Text,
    Select,
    Group,
    Checkbox,
    Notification,
    Dialog,
    Pagination,
    TextInput,
    Textarea,
    ActionIcon,
    ThemeIcon,
    Tooltip,
    Flex,
    Loader,
    Stack,
    Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface DetailTableProps {
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    title: string;
}

const DetailTable = (props: DetailTableProps): JSX.Element => {
    const { getFunction, title } = props;
    const [data, setData] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const [renewing, setRenewing] = useState(false);
    const [assignDHCP, setAssignDHCP] = useState(false);
    const { data: apiData, loading } = useApiData(getFunction);

    const formatDate = (date: string) => {
        const d = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return d.toLocaleDateString('en-US', options);
    };

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
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                <Title>{title}</Title>
                <Button onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel' : 'Edit'}
                </Button>
            </Group>
            <Group>
                {loading ? (
                    <Loader />
                ) : editing ? (
                    <Stack align="stretch" justify="center">
                        <form
                            onSubmit={form.onSubmit((values) => {
                                console.log(values);
                                setEditing(!editing);
                            })}
                        >
                            <Title mt="md" order={3}>
                                Host Details
                            </Title>
                            <TextInput
                                label="MAC Address"
                                key={form.key('mac')}
                                {...form.getInputProps('mac')}
                            />
                            <TextInput
                                label="Hostname"
                                key={form.key('hostname')}
                                {...form.getInputProps('hostname')}
                            />

                            <Select
                                label="Address Type"
                                key={form.key('is_dynamic')}
                                data={[
                                    {
                                        label: 'Dynamic, routeable address (preferred)',
                                        value: 'true',
                                    },
                                    {
                                        label: 'Dynamic non-routable address',
                                        value: 'false',
                                    },
                                ]}
                                {...form.getInputProps('is_dynamic')}
                            />
                            <Group justify="space-between">
                                <Text mt="md" mb="sm">
                                    Expiration Date:{' '}
                                </Text>
                                {data[0]?.expires ? (
                                    <Badge size="lg">
                                        {formatDate(data[0]?.expires)}
                                    </Badge>
                                ) : (
                                    'Never'
                                )}
                                <Button
                                    onClick={() => {
                                        setRenewing(!renewing);
                                    }}
                                >
                                    Renew Host
                                </Button>
                            </Group>

                            {renewing && (
                                <Select
                                    label="Expires"
                                    data={[
                                        { label: '1 Day', value: '1' },
                                        { label: '7 Days', value: '7' },
                                        { label: '14 Days', value: '14' },
                                        { label: '30 Days', value: '30' },
                                        { label: '180 Days', value: '180' },
                                        { label: '365 Days', value: '365' },
                                    ]}
                                    {...form.getInputProps('expires')}
                                />
                            )}

                            <Textarea
                                label="Description"
                                {...form.getInputProps('description')}
                            />

                            <Checkbox
                                mt="md"
                                label="Assign a DHCP Group"
                                onClick={() => setAssignDHCP(!assignDHCP)}
                            />

                            {assignDHCP && (
                                <Select
                                    label="DHCP Group NOT DONE, REQUIRES AUTOCOMPLETE"
                                    data={[
                                        { label: 'Group 1', value: '1' },
                                        { label: 'Group 2', value: '2' },
                                        { label: 'Group 3', value: '3' },
                                    ]}
                                    {...form.getInputProps('dhcp_group')}
                                />
                            )}

                            <Title mt="md" order={3}>
                                Owners
                            </Title>

                            <TextInput label="User Owner Needs Autocomplete" />
                            <TextInput label="Group Owners Needs Autocomplete" />

                            <Group justify="flex-end" mt="md">
                                <Button type="submit">Submit</Button>
                                <Button onClick={() => console.log(data)}>
                                    log
                                </Button>
                            </Group>
                        </form>
                    </Stack>
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Property</Table.Th>
                                <Table.Th>Value</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.map((item, index) =>
                                Object.keys(item).map((key) => (
                                    <Table.Tr key={`${index}-${key}`}>
                                        <Table.Td>{key}</Table.Td>
                                        <Table.Td>
                                            {typeof item[key] === 'object'
                                                ? JSON.stringify(item[key])
                                                : item[key]}
                                        </Table.Td>
                                    </Table.Tr>
                                )),
                            )}
                        </Table.Tbody>
                    </Table>
                )}
            </Group>
        </Paper>
    );
};
export default DetailTable;
