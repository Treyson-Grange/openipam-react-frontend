import { useParams } from 'react-router-dom';
import PaginatedTable from '../components/tables/PaginatedTable';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const DomainDetail = () => {
    const { domain } = useParams<{ domain: string }>() as { domain: string | number };
    const api = getApiEndpointFunctions();
    const title = 'DNS Records for ' + domain;
    return (
        <PaginatedTable
            defPageSize={10}
            getFunction={api.dns.get}
            title={title}
            neededAttr={['name', 'content', 'ttl', 'dns_type']}
            morePageSizes={['1']}
            sortable={true}
            searchable={true}
            searchableFields={['name', 'content', 'dns']}
            additionalUrlParams={{ "content": String(domain) }}
        />
    );
}

export default DomainDetail;