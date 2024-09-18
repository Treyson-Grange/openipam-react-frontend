import PaginatedTable from '../tables/PaginatedTable';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
const MyDNSRecords = () => {
    const api = getApiEndpointFunctions();

    const handleEditFunction = (dnsName: string) => {
        return (editValues: any) => {
            return api.dns.byId(`${dnsName}`).update(editValues);
        };
    };

    return (
        <PaginatedTable
            getFunction={api.dns.mine}
            title="My DNS Records"
            neededAttr={['name', 'content', 'ttl', 'dns_type']}
            sortable={true}
            searchable={true}
            searchableFields={['name', 'content', 'dns']}
            editableObj={true}
            editFunction={handleEditFunction}
            editableFields={['name', 'content', 'ttl']}
            detail="dns"
            detailField="id"
            noDataMessage="You don't own any DNS records."
        />
    );
};

export default MyDNSRecords;
