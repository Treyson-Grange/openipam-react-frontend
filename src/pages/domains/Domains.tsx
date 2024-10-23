import DomainGrid from '../../components/domains/DomainGrid';
import MyDNSRecords from '../../components/dns/MyDNSRecords';

/**
 * Domains page component
 */
const Domains = () => {
    return (
        <>
            <DomainGrid />
            <MyDNSRecords />
        </>
    );
};

export default Domains;
