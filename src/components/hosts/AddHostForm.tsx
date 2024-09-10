import { useForm } from '@mantine/form';
import {
    Button,
    Group,
    TextInput,
    Card,
    Select,
    Title,
    Radio,
} from '@mantine/core';

const AddHostForm = () => {
    const EMPTY_CHOICE = '----';

    const form = useForm({
        initialValues: {
            macAddress: '',
            hostname: '',
            addressType: '----',
            networkOrIP: '',
        },
        validate: {
            // macAddress: (value) =>
            //     checkMacAddress(value) ? null : 'Invalid MAC Address',
            // hostname: (value) =>
            //     value.trim().length > 0 ? null : 'Invalid Hostname',
            // addressType: (value) =>
            //     value !== EMPTY_CHOICE ? null : 'Please select an Address Type',
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Card>
                <Title mb="lg">Add Host</Title>
                <Title order={3} component="h2" mb="lg">
                    Host Details
                </Title>

                <TextInput
                    withAsterisk
                    label="MAC Address"
                    {...form.getInputProps('macAddress')}
                />
                <TextInput
                    withAsterisk
                    label="Hostname"
                    {...form.getInputProps('hostname')}
                />
                <Select
                    label="Address Type"
                    placeholder={EMPTY_CHOICE}
                    {...form.getInputProps('addressType')}
                    data={[
                        'Dynamic, routable address (preferred)',
                        'Dynamic, non-routable address',
                    ]}
                />

                <Radio.Group
                    label="Network or IP"
                    {...form.getInputProps('networkOrIP')}
                    mt="sm"
                    mb="sm"
                >
                    <Group>
                        <Radio value="Network" label="Network" />
                        <Radio value="IP" label="IP" />
                    </Group>
                </Radio.Group>

                <Select
                    label="Network"
                    placeholder={EMPTY_CHOICE}
                    {...form.getInputProps('network')}
                    data={[EMPTY_CHOICE]}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Add Host</Button>
                </Group>
            </Card>
        </form>
    );
};

export default AddHostForm;
