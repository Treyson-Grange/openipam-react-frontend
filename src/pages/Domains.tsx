import PaginatedTable from '../components/tables/PaginatedTable';
import DomainGrid from '../components/DomainGrid';
import { useState } from 'react';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { useAuth } from '../contexts/AuthContext';

const Domains = () => {
    const [pageSize] = useState<number>(10);
    const api = getApiEndpointFunctions();
    const auth = useAuth();
    // if (auth.isAdmin()) {
    //     //paginated table cant handle the links for the domains. fix l8er
    //     return (
    //         <>
    //             <PaginatedTable
    //                 defPageSize={pageSize}
    //                 getFunction={api.domain.get}
    //                 title='Domains'
    //                 neededAttr={['id', 'name', 'record_count']}
    //                 morePageSizes={['1']}
    //                 sortable={true}
    //                 searchable={true}
    //                 searchableFields={['name', 'dns_view', 'dns_type']}
    //             />
    //         </>
    //     )
    // } else {
    return (
        <DomainGrid />
    )
    // }
};

export default Domains;