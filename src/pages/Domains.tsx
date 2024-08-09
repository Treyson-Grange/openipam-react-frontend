import PaginatedTable from '../components/tables/PaginatedTable';
import DomainGrid from '../components/DomainGrid';
import { useState } from 'react';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const Domains = () => {
    /**
     * For use in the pagination table. Deletes a DNS record by ID.
     * @param id 
     */
    const deleteDNSRecord: (id: number) => void = (id: number) => {
        try {
            api.dns.byId(id).delete().then(() => {
                console.log('Deleted DNS Record');
            });
        } catch (error) {
            throw new Error();
        }
    }

    /**
     * For use in the pagination table. Logs a host by ID. POC only.
     * @param id 
     */
    const logHost: (id: string) => void = (id: string) => {
        try {
            api.host.byId(id).get().then((response) => {
                console.log(response)
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [pageSize] = useState<number>(10);
    const api = getApiEndpointFunctions();

    return (
        <>
            {/* <PaginatedTable
                defPageSize={pageSize}
                getFunction={api.domain.get}
                title="You Domains"
                neededAttr={['name', 'record_count', 'changed', 'id']}
                editableObj={true}
                morePageSizes={['10', '25', '50']}
                overridePageSizes={true}
                sortable={true}
                sortableFields={['name', 'ttl', 'dns_type']}
                searchable={true}
                searchableFields={['name', 'content', 'dns_type']}
                actions={['Delete Selected Dns Records', 'Log Host']}
                actionFunctions={{
                    DeleteSelectedDnsRecords: { func: deleteDNSRecord, key: 'id' },
                    LogHost: { func: logHost, key: 'host' }
                }}
            /> */}
            <DomainGrid />
        </>
    );
};

export default Domains;