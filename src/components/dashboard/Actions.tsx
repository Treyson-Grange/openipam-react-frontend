import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../tables/PaginatedTable';

const Actions = (): JSX.Element => {
    const api = getApiEndpointFunctions();
    return (
        <>
            <PaginatedTable
                getFunction={api.logs.mylogs}
                title="Recent Actions"
                neededAttr={['content_type', 'object_repr', 'action_time']}
                sortable={true}
                sortableFields={['content_type', 'object_repr', 'action_time']}
            />
        </>
    );
};

export default Actions;
