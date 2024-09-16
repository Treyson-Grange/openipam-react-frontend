import HostControl from '../../components/hosts/HostControl';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import PaginatedTable from '../../components/tables/PaginatedTable';
import AddHost from '../../components/hosts/AddHost';
import { Group } from '@mantine/core';

const UserHosts = () => {
    const api = getApiEndpointFunctions();
    return (
        <>
            <Group justify="flex-end">
                <AddHost />
                <HostControl currentSelection={'userHosts'} />
            </Group>
            <PaginatedTable
                title={'Your Hosts'}
                neededAttr={[
                    'hostname',
                    'mac',
                    'expires',
                    'master_ip_address',
                    'vendor',
                    'last_seen',
                    'last_seen_ip',
                ]}
                getFunction={api.hosts.myhosts}
                defPageSize={10}
                noDataMessage={`You don't own any hosts. If you feel this is an error, please contact an administrator.`}
                highlightDates={true}
                detail="hosts"
                detailField="mac"
            />
        </>
    );
};

export default UserHosts;
