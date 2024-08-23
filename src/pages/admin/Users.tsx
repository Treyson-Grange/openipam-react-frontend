import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';

const Users = () => {
    const api = getApiEndpointFunctions();
    return (
        <PaginatedTable
            getFunction={api.users.get}
            title="Users"
            neededAttr={[
                'username',
                'email',
                'full_name',
                'is_active',
                'is_staff',
                'is_ipamadmin',
                'is_superuser',
                'is_active',
                'source',
                'last_login',
            ]}
            defPageSize={10}
            searchable={true}
            searchableFields={['username', 'email', 'full_name']}
        />
    );
};

export default Users;
