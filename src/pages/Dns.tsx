import PaginatedTable from "../components/tables/PaginatedTable";
import { useState } from 'react';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { Button } from "@mantine/core";


export async function apiCall(url: string, method: string, body: Record<string, any> | null, csrftoken: string): Promise<any> {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : null
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`${response.status}`);
    }
    return response.json();
}

const Dns = () => {
    const navigate = useNavigate();
    const { config } = useConfig();
    const csrftoken = useCsrfToken();

    const deleteDNSRecord: (id: number) => void = (id: number) => {
        try {
            api.dns.byId(id).delete().then(() => {
                console.log('Deleted DNS Record');
            });
        } catch (error) {
            console.error(error);
        }
    }
    const handleLogout = async () => {
        try {
            const url = `${config.apiUrl}/logout/`;
            const data = await apiCall(url, 'POST', null, csrftoken.csrftoken);
            console.log(data);
            navigate('/login')
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

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
                actions={['Delete Selected Dns Records']}
                morePageSizes={['10', '25', '50']}
                overridePageSizes={true}
                actionFunctions={{
                    DeleteSelectedDnsRecords: deleteDNSRecord
                }}
            />
            <Button onClick={handleLogout}>
                LOgout
            </Button>
        </>
    );
};

export default Dns;