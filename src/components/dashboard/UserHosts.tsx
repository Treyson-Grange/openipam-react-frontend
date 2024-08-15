import PaginatedTable from '../tables/PaginatedTable';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';

const UserHosts = () => {
    const api = getApiEndpointFunctions();

    return (
        <PaginatedTable
            getFunction={api.hosts.myhosts}
            title='Your Hosts'
            noDataMessage='No hosts found'
            neededAttr={['hostname', 'ip_address', 'mac_address', 'description']}
            defPageSize={10}
        />
    );
}
export default UserHosts;