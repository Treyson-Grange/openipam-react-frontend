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
            <PaginatedTable
                defPageSize={5}
                getFunction={api.groups.get}
                title='Groups'
                neededAttr={['name', 'id', 'permissions']}
                editableObj={true}
                actions={['Change Source Internal', 'Change Source LDAP']}
                sortable={true}
                actionFunctions={{
                    ChangeSourceInternal: (id: number) => console.log(`Editing group ${id}`),
                    ChangeSourceLDAP: (id: number) => console.log(`Deleting group ${id}`)
                }}
                searchable={true}
                searchableFields={['name']}
            />
        </>
    );
}

export default Actions;
