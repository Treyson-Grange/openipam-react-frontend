import { useNavigate } from 'react-router-dom';

import { Group, Card, Title, ActionIcon } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';

/**
 * Component that displays a button to add a new host.
 */
const AddHost = () => {
    const navigate = useNavigate();
    return (
        <Group justify="flex-end" mr="xl">
            <Card radius="lg" onClick={() => navigate('/hosts/add')}>
                <Group>
                    <Title order={4}>Add Host</Title>
                    <ActionIcon aria-label="Add Host" size="xl">
                        <FaPlus />
                    </ActionIcon>
                </Group>
            </Card>
        </Group>
    );
};

export default AddHost;
