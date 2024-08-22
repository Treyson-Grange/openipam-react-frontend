import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/hosts/HostControl';
import { useConfig } from '../../contexts/ConfigContext';
import { Flex, Group, Card, Title, ActionIcon } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
const AllHosts = () => {
    const api = getApiEndpointFunctions();
    const { config } = useConfig();
    return (
        <>
            <Group justify="flex-end">
                <Group justify="flex-end" mr="xl">
                    <Card radius="lg">
                        <Group>
                            <Title order={4}>Add DNS Record</Title>
                            <ActionIcon
                                size="xl"
                                onClick={() => console.log('asdf')}
                            >
                                <FaPlus />
                            </ActionIcon>
                        </Group>
                    </Card>
                </Group>
                <Flex justify="flex-end">
                    <HostControl currentSelection={'allHosts'} />
                </Flex>
            </Group>
            <PaginatedTable
                title={`All ${config.organizationName} Hosts`}
                neededAttr={[
                    'hostname',
                    'mac',
                    'expires',
                    'master_ip_address',
                    'vendor',
                    'last_seen',
                    'last_seen_ip',
                ]}
                getFunction={api.hosts.all}
                defPageSize={10}
                noDataMessage={'No hosts found'}
                highlightDates={true}
            />
        </>
    );
};

export default AllHosts;
