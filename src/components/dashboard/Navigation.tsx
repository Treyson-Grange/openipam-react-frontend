import { Text, Paper, Title, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const items = {
        'List Hosts': 'hosts',
        'Add Host': 'hostsadd',
        'DNS Records': 'dns',
        'Feature or Bug?': 'request',
        'Profile': 'profile',
    }
    return (
        <Paper p='lg' m='lg' radius='lg' withBorder>
            <Title order={1} mb='xl'>Navigation</Title>
            <Table>
                <Table.Tbody>
                    {Object.entries(items).map(([label, link]) => (
                        <Table.Tr key={label}>
                            <Table.Td>
                                <Text>
                                    <a
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'text-decoration 0.2s',
                                        }}
                                        onClick={() => navigate(link)}
                                        onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}
                                    >
                                        {label}
                                    </a>
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Paper>
    );
};

export default Navigation;