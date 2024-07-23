import { useState } from 'react';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';
import { Button } from '@mantine/core';

const Actions = (): JSX.Element => {
    const [pageSize] = useState<number>(5);
    const api = getApiEndpointFunctions();
    const handleLogout = async () => {
        try {
            api.auth.logout();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
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
            <Button onClick={handleLogout}>Logout</Button>
        </>
    );
}

export default Actions;
