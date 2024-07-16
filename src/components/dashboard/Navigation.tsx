import { Text, Paper, Title, Table } from '@mantine/core';


const Navigation = () => {
    const items = {
        "List Hosts": "/hosts",
        "Add Host": "/hosts/add",
        "DNS Records": "/dns",
        "Feature or Bug?": "/request",
        "Profile": "/profile",
    }
    return (
        <Paper radius="md" p="lg" m="lg" withBorder>
            <Title order={1} mb="xl">Navigation</Title>
            <Table>
                <Table.Tbody>
                    {Object.entries(items).map(([label, link]) => (
                        <Table.Tr key={label}>
                            <Table.Td>
                                <Text>
                                    <a
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                            transition: "text-decoration 0.2s",
                                        }}
                                        href={link}
                                        onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = "underline"}
                                        onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = "none"}
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