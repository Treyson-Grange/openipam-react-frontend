import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/hosts/HostControl';
import { useConfig } from '../../contexts/ConfigContext';
import { Flex } from '@mantine/core';
const AllHosts = () => {
    const api = getApiEndpointFunctions();
    const { config } = useConfig();
    return (
        <>
            <Flex justify="flex-end">
                <HostControl currentSelection={'allHosts'} />
            </Flex>
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
