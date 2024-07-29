import PaginatedTable from '../components/tables/PaginatedTable';
import { useState } from 'react';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const Dns = () => {
    const deleteDNSRecord: (id: number) => void = (id: number) => {
        try {
            api.dns.byId(id).delete().then(() => {
                console.log('Deleted DNS Record');
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [pageSize] = useState<number>(10);
    const api = getApiEndpointFunctions();

    return (
        <>
            <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.dns.get}
                title='DNS Records'
                neededAttr={['name', 'ttl', 'dns_type', 'content']}
                editableObj={true}
                morePageSizes={['10', '25', '50']}
                overridePageSizes={true}
                sortable={true}
                sortableFields={['name', 'ttl', 'dns_type']}
                searchable={true}
                searchableFields={['name', 'content', 'dns_type']}
                actions={['Delete Selected Dns Records']}
                actionFunctions={{ DeleteSelectedDnsRecords: deleteDNSRecord }}
            />
        </>
    );
};

export default Dns;