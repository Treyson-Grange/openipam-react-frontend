import { useForm } from '@mantine/form';
import { Button, Group, TextInput, Card, Select } from '@mantine/core';

const AddHostForm = () => {
    const checkMacAddress = (value: string) => {
        const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        return macAddressRegex.test(value) ? true : false;
    };

    const form = useForm({
        initialValues: {
            macAddress: '',
            hostname: '',
            addressType: '----',
        },
        validate: {
            macAddress: (value) =>
                checkMacAddress(value) ? null : 'Invalid MAC Address',
            hostname: (value) =>
                value.trim().length > 0 ? null : 'Invalid Hostname',
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Card>
                <TextInput
                    withAsterisk
                    label="MAC Address"
                    key={form.key('macAddress')}
                    {...form.getInputProps('macAddress')}
                />
                <TextInput
                    withAsterisk
                    label="Hostname"
                    key={form.key('hostname')}
                    {...form.getInputProps('hostname')}
                />
                <Select
                    label="Address Type"
                    key={form.key('addressType')}
                    placeholder="-----------------"
                    {...form.getInputProps('addressType')}
                    data={[
                        'Dynamic, routable address (preferred)',
                        'Dynamic, non-routable address',
                    ]}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Add Host</Button>
                </Group>
            </Card>
        </form>
    );
};

export default AddHostForm;
