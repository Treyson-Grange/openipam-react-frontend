import PaginatedTable from '../tables/PaginatedTable';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';

/**
 * Displays a `PaginatedTable` of the user's hosts.
 */
const UserHosts = () => {
    const api = getApiEndpointFunctions();

    return (
        <PaginatedTable
            getFunction={api.hosts.myhosts}
            title="Your Hosts"
            noDataMessage="No hosts found"
            neededAttr={['hostname', 'mac', 'vendor', 'description']}
            defPageSize={10}
        />
    );
};
export default UserHosts;
