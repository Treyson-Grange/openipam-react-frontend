import { useParams } from 'react-router-dom';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import DetailView from '../../components/DetailView';

/**
 * DNSDetail page component,
 * TODO: currently, title is just the ID, so a number. So not cool.
 */
const DNSDetail = () => {
    const { dns } = useParams<{ dns: string }>() as {
        dns: string | number;
    };
    const api = getApiEndpointFunctions();
    const title = ' ' + dns;

    return <DetailView getFunction={api.dns.byId(dns).get} title={title} />;
};

export default DNSDetail;
