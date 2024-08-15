import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';

const Actions = (): JSX.Element => {
    const api = getApiEndpointFunctions();
    return (
        <>
            <PaginatedTable
                getFunction={api.logs.mylogs}
                title='Recent Actions'
                neededAttr={['content_type', 'object_repr', 'action_time']}
                morePageSizes={['1']}
                sortable={true}
                sortableFields={['content_type', 'object_repr', 'action_time']}
            />
            {/* <PaginatedTable
                getFunction={api.groups.get}
                title='Groups'
                neededAttr={['name', 'id', 'permissions']}
                editableObj={true}
                sortable={true}
                sortableFields={['name', 'id']}
                actions={['Change Source Internal', 'Change Source LDAP']}
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
