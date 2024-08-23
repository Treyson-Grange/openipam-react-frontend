import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import UserTable from '../../components/tables/UserTable';

const Users = () => {
    const api = getApiEndpointFunctions();
    return (
        <UserTable
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
                'source',
                'last_login',
            ]}
            defPageSize={25}
            morePageSizes={['25', '50', '100', '250']}
            overridePageSizes={true}
            searchable={true}
            searchableFields={['username', 'email', 'full_name']}
            sortable={true}
            sortableFields={[
                'is_active',
                'is_staff',
                'is_ipamadmin',
                'is_superuser',
            ]}
        />
    );
};

export default Users;
