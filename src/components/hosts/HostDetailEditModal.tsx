interface HostDetailEditModalProps {
    data: any;
}

import {
    Stack,
    Title,
    TextInput,
    Select,
    Group,
    Text,
    Badge,
    Button,
    Textarea,
    Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useEffect } from 'react';

const HostDetailEditModal = (props: HostDetailEditModalProps) => {
    const { data } = props;
    const [editing, setEditing] = useState(false);
    const [renewing, setRenewing] = useState(false);
    const [assignDHCP, setAssignDHCP] = useState(false);

    const form = useForm({});

    const formatDate = (date: string) => {
        const d = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return d.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        form.setValues({
            hostname: data[0]?.hostname,
            mac: data[0]?.mac,
            is_dynamic: data[0]?.is_dynamic == true ? 'true' : 'false',
            description: data[0]?.description,
        });
    }, [data]);

    return (
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
                        <Badge size="lg">{formatDate(data[0]?.expires)}</Badge>
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
                    <Button onClick={() => console.log(data)}>log</Button>
                </Group>
            </form>
        </Stack>
    );
};

export default HostDetailEditModal;
