import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';

const Actions = (): JSX.Element => {
    const api = getApiEndpointFunctions();
    return (
        <>
            <PaginatedTable
                defPageSize={5}
                getFunction={api.logs.mylogs}
                title='Recent Actions'
                neededAttr={['content_type', 'object_repr', 'action_time']}
                morePageSizes={['1']}
                sortable={true}
            />
            {/* <PaginatedTable
                defPageSize={5}
                getFunction={api.groups.get}
                title='Groups'
                neededAttr={['name', 'id', 'permissions']}
                editableObj={true}
                actions={['Change Source Internal', 'Change Source LDAP']}
                sortable={true}
                actionFunctions={{
                    ChangeSourceInternal: { func: (id: number) => console.log(`Editing group ${id}`), key: 'id' },
                    ChangeSourceLDAP: { func: (id: number) => console.log(`Deleting group ${id}`), key: 'id' }
                }}
                searchable={true}
                searchableFields={['name']}
            /> */}
        </>
    );
}

export default Actions;
