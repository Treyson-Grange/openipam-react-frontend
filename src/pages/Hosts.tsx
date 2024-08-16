import React from 'react';
import { Button } from '@mantine/core';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import PaginatedTable from '../components/tables/PaginatedTable';


const Hosts: React.FC<{ viewType: "userHosts" | "allHosts" }> = ({ viewType }) => {
    const api = getApiEndpointFunctions();
    const attributes = ["hostname", "mac", "expires", "master_ip_address", "vendor", "last_seen", "last_seen_ip"];

    return (
        <>
            <Button
                onClick={() => window.location.href = "/hosts/all"}
                disabled={viewType === "allHosts"}
            >All hosts</Button>
            <Button
                onClick={() => window.location.href = "/hosts"}
                disabled={viewType === "userHosts"}
            >Your hosts</Button>
            {viewType === "allHosts" ? (
                <PaginatedTable
                    title={"All USU Hosts"}
                    getFunction={api.hosts.all}
                    neededAttr={attributes}
                    defPageSize={10}
                />
            ) : (
                <PaginatedTable
                    title={"Your Hosts"}
                    neededAttr={attributes}
                    getFunction={api.hosts.myhosts}
                    defPageSize={10}
                />
            )}
        </>
    );
}

export default Hosts;
