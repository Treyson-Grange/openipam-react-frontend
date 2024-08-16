import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import HostControl from '../../components/HostControl';

const AllHosts = () => {
    const api = getApiEndpointFunctions();

    return (
        <>
            <HostControl currentSelection={"allHosts"} />
            <PaginatedTable
                title={"Your Hosts"}
                neededAttr={["hostname", "mac", "expires", "master_ip_address", "vendor", "last_seen", "last_seen_ip"]}
                getFunction={api.hosts.all}
                defPageSize={10}
                noDataMessage={"No hosts found"}
            />
        </>
    );
}

export default AllHosts;
