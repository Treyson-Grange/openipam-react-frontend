import HostControl from '../../components/HostControl';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';

const UserHosts = () => {
    const api = getApiEndpointFunctions();

    return (
        <>
            <HostControl currentSelection={"userHosts"} />
            <PaginatedTable
                title={"Your Hosts"}
                neededAttr={["hostname", "mac", "expires", "master_ip_address", "vendor", "last_seen", "last_seen_ip"]}
                getFunction={api.hosts.myhosts}
                defPageSize={10}
                noDataMessage={"No owned hosts found. If you feel this is an error, please contact an administrator."}
            />
        </>
    );
}

export default UserHosts;
