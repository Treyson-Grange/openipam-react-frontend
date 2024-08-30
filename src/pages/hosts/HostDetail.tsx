import { useParams } from 'react-router-dom';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import DetailView from '../../components/DetailView';
import HostDetailEditModal from '../../components/hosts/HostDetailEditModal';

const HostDetail = () => {
    const { host } = useParams<{ host: string }>() as {
        host: string | number;
    };
    const api = getApiEndpointFunctions();
    const title = 'Host Detail for ' + host;

    return (
        <DetailView
            getFunction={api.hosts.byId(host).get}
            title={title}
            editable={true}
            ModalComponent={HostDetailEditModal}
        />
    );
};

export default HostDetail;
