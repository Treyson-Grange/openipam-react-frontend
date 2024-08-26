import { useParams } from 'react-router-dom';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
// import { ActionIcon, Group, Card, Title } from '@mantine/core';
import DetailTable from '../../components/DetailTable';
const HostDetail = () => {
    const { host } = useParams<{ host: string }>() as {
        host: string | number;
    };
    const api = getApiEndpointFunctions();
    const title = 'Host Detail for ' + host;

    return <DetailTable title={title} getFunction={api.hosts.byId(host).get} />;
};

export default HostDetail;
