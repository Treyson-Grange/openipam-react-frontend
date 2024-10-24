import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/hosts/HostControl';
import { useConfig } from '../../contexts/ConfigContext';
import { Group } from '@mantine/core';
import AddHost from '../../components/hosts/AddHost';

/**
 * AllHosts page component
 * Features all hosts in a paginated table, and HostControl for switching between all hosts and users hosts.
 */
const AllHosts = () => {
    const api = getApiEndpointFunctions();
    const { config } = useConfig();
    return (
        <>
            <Group justify="flex-end">
                <AddHost />
                <HostControl currentSelection={'allHosts'} />
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
                advancedSearch={true}
                defPageSize={10}
                noDataMessage={'No hosts found'}
                highlightDates={true}
                detail="hosts"
                detailField="mac"
            />
        </>
    );
};

export default AllHosts;
