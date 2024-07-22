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
                actions={['Test', 'For', 'UI']}
            />
            <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.groups.get}
                title='Groups'
                neededAttr={['name', 'id', 'permissions']}
                editableObj={true}
                actions={['Edit', 'Delete']}
                sortable={true}
                actionFunctions={{
                    Edit: (id: number) => console.log(`Editing group ${id}`),
                    Delete: (id: number) => console.log(`Deleting group ${id}`)
                }}
            />
        </>
    );
}

export default Actions;
