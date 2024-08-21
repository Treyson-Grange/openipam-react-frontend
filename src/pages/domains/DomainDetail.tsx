import { useParams } from 'react-router-dom';
import PaginatedTable from '../../components/tables/PaginatedTable';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import AddRecordModal from '../../components/domains/AddRecordModal';
import { ActionIcon, Group, Card, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaPlus } from 'react-icons/fa';

const DomainDetail = () => {
    const { domain } = useParams<{ domain: string }>() as {
        domain: string | number;
    };
    const api = getApiEndpointFunctions();
    const title = 'DNS Records for ' + domain;

    const handleEditFunction = (dnsName: string) => {
        return (editValues: any) => {
            return api.dns.byId(`${dnsName}`).update(editValues);
        };
    };

    const [modalOpened, handlers] = useDisclosure(false);

    const handleModalChange = () => {
        handlers.toggle();
    };

    return (
        <>
            <Group justify="flex-end" mr="xl">
                <Card radius="lg">
                    <Group>
                        <Title order={4}>Add DNS Record</Title>
                        <ActionIcon size="xl" onClick={handleModalChange}>
                            <FaPlus />
                        </ActionIcon>
                    </Group>
                </Card>
            </Group>
            <PaginatedTable
                defPageSize={10}
                getFunction={api.domain.byId(domain).getRecords}
                title={title}
                neededAttr={['name', 'content', 'ttl', 'dns_type']}
                sortable={true}
                searchable={true}
                searchableFields={['name', 'content', 'dns']}
                editableObj={true}
                editFunction={handleEditFunction}
                editableFields={['name', 'content', 'ttl']}
            />
            <AddRecordModal
                opened={modalOpened}
                onClose={handleModalChange}
                domain={domain}
            />
        </>
    );
};

export default DomainDetail;
