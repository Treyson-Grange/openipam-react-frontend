import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/HostControl';
import { useConfig } from '../../contexts/ConfigContext';
const AllHosts = () => {
    const api = getApiEndpointFunctions();
    const { config } = useConfig();
    return (
        <>
            <HostControl currentSelection={"allHosts"} />
            <PaginatedTable
                title={`All ${config.organizationName} Hosts`}
                neededAttr={["hostname", "mac", "expires", "master_ip_address", "vendor", "last_seen", "last_seen_ip"]}
                getFunction={api.hosts.all}
                defPageSize={10}
                noDataMessage={"No hosts found"}
                highlightDates={true}
            />
        </>
    );
}

export default AllHosts;
