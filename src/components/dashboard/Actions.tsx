import { useState } from 'react';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';

const Actions = (): JSX.Element => {
    const [pageSize] = useState<number>(5);
    const api = getApiEndpointFunctions();

    return (
        <>
            <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.logs.mylogs}
                title='Recent Actions'
                neededAttr={['content_type', 'object_repr', 'action_time']}
                morePageSizes={['1']}
                sortable={true}
                actions={['Test', 'For', 'UI']}
            />
            <PaginatedTable
                defPageSize={pageSize}
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
            />
        </>
    );
}

export default Actions;
