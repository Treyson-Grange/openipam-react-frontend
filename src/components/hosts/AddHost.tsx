import { useNavigate } from 'react-router-dom';

import { Group, Card, Title, ActionIcon } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';

const AddHost = () => {
    const navigate = useNavigate();
    return (
        <Group justify="flex-end" mr="xl">
            <Card radius="lg">
                <Group>
                    <Title order={4}>Add Host</Title>
                    <ActionIcon
                        size="xl"
                        onClick={() => navigate('/hosts/add')}
                    >
                        <FaPlus />
                    </ActionIcon>
                </Group>
            </Card>
        </Group>
    );
};

export default AddHost;
