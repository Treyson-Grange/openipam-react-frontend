import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/hosts/HostControl';
import { useConfig } from '../../contexts/ConfigContext';
import { Group } from '@mantine/core';
import AddHost from '../../components/hosts/AddHost';
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
                defPageSize={10}
                noDataMessage={'No hosts found'}
                highlightDates={true}
            />
        </>
    );
};

export default AllHosts;
