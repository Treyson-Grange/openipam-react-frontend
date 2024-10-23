interface DNSDetailEditModalProps {
    data: any;
}

import { Stack, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useEffect } from 'react';

import { formatDateShort } from '../../utilities/format';
/**
 * Started work on the DNSDetailEditModal component. This is unused, and unfinished.
 * Supposedly used to edit DNS records, when you are on their detail page.
 */
const DNSDetailEditModal = (props: DNSDetailEditModalProps) => {
    const { data } = props;
    const [editing, setEditing] = useState(false);

    // Use states to handle conditional rendering of form fields
    // const [renewing, setRenewing] = useState(false);
    // const [assignDHCP, setAssignDHCP] = useState(false);

    const form = useForm({});

    useEffect(() => {
        form.setValues({
            //Fill this out with the form fields
            // eg. hostname: data[0]?.hostname,
        });
    }, [data]);

    return (
        <Stack align="stretch" justify="center">
            <Title>Starter Edit Modal.</Title>
            <Text>{formatDateShort(Date())}</Text>
            <form
                onSubmit={form.onSubmit((values) => {
                    console.log(values);
                    setEditing(!editing);
                })}
            ></form>
        </Stack>
    );
};

export default DNSDetailEditModal;
