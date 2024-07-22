import { useState } from 'react';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';
import { usePaginatedApi } from '../../hooks/useApi';

const Actions = (): JSX.Element => {
    const [pageSize] = useState<number>(5);
    const api = getApiEndpointFunctions();
    const { data: asdf } = usePaginatedApi(api.logs.get, 1, 5);
    console.log(asdf);
    return (
        <>
            <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.logs.mylogs}
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
