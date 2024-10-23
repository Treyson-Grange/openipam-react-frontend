import {
    Modal,
    TextInput,
    Group,
    Button,
    Select,
    NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';

type RecordModalProps = {
    /**
     * If the modal is opened or not
     */
    opened: boolean;
    /**
     * Function to call when the modal is closed
     */
    onClose: () => void;
    /**
     * Domain to add the record to
     */
    domain: string | number;
};

/**
 * Modal to add a new DNS record
 * Unfinished, it's close, however not always functional.
 */
const AddRecordModal = (props: RecordModalProps): JSX.Element => {
    const api = getApiEndpointFunctions();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            dns_type: 'A',
            ttl: 14400,
            content: '',
        },
        validate: {
            name: (value) => (value.trim().length > 0 ? null : 'Invalid Name'), // just exist and not empty for now
            dns_type: (value) =>
                value.trim().length > 0 ? null : 'Invalid DNS Type',
            ttl: (value) => (value > 0 ? null : 'Invalid TTL'),
            content: (value) =>
                value.trim().length > 0 ? null : 'Invalid Content',
        },
    });

    const handleSubmit = async (values: any) => {
        let isIp = false;
        console.log(values);
        const ipv4regex =
            '^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(.(?!$)|$)){4}$';
        const ipv6regex =
            '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))';
        if (values.content.match(ipv4regex)) {
            isIp = true;
        } else if (values.content.match(ipv6regex)) {
            isIp = true;
        }
        console.log('is IP? ', isIp);

        const response = await api.dns.create({
            name: values.name,
            dns_type: values.dns_type,
            ttl: values.ttl,
            text_content: isIp ? null : values.content,
            ip_content: isIp ? values.content : null,
        });
        console.log(response);
    };

    return (
        <Modal
            opened={props.opened}
            onClose={props.onClose}
            title="Add DNS Record"
        >
            <form
                onSubmit={form.onSubmit((values) => {
                    handleSubmit(values);
                })}
            >
                <TextInput
                    withAsterisk
                    label="Name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <Select
                    label="DNS Type"
                    key={form.key('dns_type')}
                    {...form.getInputProps('dns_type')}
                    data={[
                        'A',
                        'AAAA',
                        'CNAME',
                        'HINFO',
                        'MX',
                        'NS',
                        'PTR',
                        'SOA',
                        'SRV',
                        'SSHFP',
                        'TXT',
                    ]}
                />
                <NumberInput
                    label="TTL"
                    key={form.key('ttl')}
                    {...form.getInputProps('ttl')}
                />

                <TextInput
                    withAsterisk
                    label="Content"
                    key={form.key('content')}
                    {...form.getInputProps('content')}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default AddRecordModal;
