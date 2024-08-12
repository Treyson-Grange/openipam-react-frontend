import { useParams } from 'react-router-dom';
import PaginatedTable from '../components/tables/PaginatedTable';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const DomainDetail = () => {
    const { domain } = useParams<{ domain: string }>() as { domain: string | number };
    const api = getApiEndpointFunctions();
    const title = 'DNS Records for ' + domain;

    const handleEditFunction = (dnsName: string) => {
        return (editValues: any) => {
            return api.dns.byId(`${dnsName}`).update(editValues);
        };
    };

    return (
        <PaginatedTable
            defPageSize={10}
            getFunction={api.domain.byId(domain).getRecords}
            title={title}
            neededAttr={['name', 'content', 'ttl', 'dns_type']}
            morePageSizes={['1']}
            sortable={true}
            searchable={true}
            searchableFields={['name', 'content', 'dns']}
            editableObj={true}
            editFunction={handleEditFunction}
            editableFields={['name', 'content', 'ttl']}
        />
    );
}

export default DomainDetail;