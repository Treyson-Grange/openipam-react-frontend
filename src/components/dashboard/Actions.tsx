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
                getFunction={api.logs.get}
                title='Recent Actions'
                neededAttr={['content_type', 'object_repr', 'action_time']}
                morePageSizes={['15', '25', '50']}
            />
            <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.groups.get}
                title='Groups'
                neededAttr={['name', 'id', 'permissions']}
                editableObj={true}
                actions={['Edit', 'Delete']}
                actionFunctions={{
                    Edit: (id: number) => console.log(`Editing group ${id}`),
                    Delete: (id: number) => console.log(`Deleting group ${id}`)
                }}
            />
        </>
    );
}

export default Actions;
