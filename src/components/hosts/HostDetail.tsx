import { useState, useEffect } from 'react';
import { PaginatedData } from '../../types/api';
import { useApiData } from '../../hooks/useApi';
import { QueryRequest } from '../../utilities/apiFunctions';
import { formatHeader } from '../../utilities/format';
import {
    Button,
    Paper,
    Title,
    Group,
    Loader,
    Text,
    Tabs,
    Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface HostDetailViewProps {
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    title: string;
    editable?: boolean;
    ModalComponent?: React.ComponentType<{ data: any; title: string }>;
}

const GENERAL_TAB = [
    'mac',
    'vendor',
    'is_dynamic',
    'description',
    'hostname',
    'last_seen',
];
const OWNER_TAB = ['user_owners', 'group_owners'];

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
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                <Title>{title}</Title>
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
                    <Tabs defaultValue="General" variant="pills">
                        <Tabs.List mt="lg" mb="lg">
                            <Tabs.Tab title="General" value="General">
                                General
                            </Tabs.Tab>
                            <Tabs.Tab title="Owner" value="Owner">
                                Owner
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="General">
                            {!loading && data.length !== 0 && (
                                <Group justify="space-between">
                                    <Paper p="lg" withBorder radius="xl">
                                        <Stack>
                                            {GENERAL_TAB.map((key) => (
                                                <Group justify="space-between">
                                                    <Text
                                                        ta="left"
                                                        fw={600}
                                                        size="xl"
                                                        key={key}
                                                    >
                                                        {formatHeader(key)}:{' '}
                                                    </Text>
                                                    <Text ta="left" size="xl">
                                                        {data[0][key] !==
                                                            null &&
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
                                    <Paper
                                        p="lg"
                                        withBorder
                                        radius="xl"
                                        mt="lg"
                                    >
                                        <Stack>
                                            {OWNER_TAB.map((key) => (
                                                <Group justify="space-between">
                                                    <Text
                                                        ta="left"
                                                        fw={600}
                                                        size="xl"
                                                        key={key}
                                                    >
                                                        {formatHeader(key)}:{' '}
                                                    </Text>
                                                    <Text ta="left" size="xl">
                                                        {data[0][key] !==
                                                            null &&
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
                                </Group>
                            )}
                        </Tabs.Panel>
                        <Tabs.Panel value="Owner">
                            Owner: This string is long enough to keep itself on
                            the same line
                        </Tabs.Panel>
                    </Tabs>
                )}
            </Group>
        </Paper>
    );
};

export default HostDetailView;
