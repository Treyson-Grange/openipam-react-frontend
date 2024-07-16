import { Text, Paper, Title, Table } from '@mantine/core';

const Admin = () => {
    const items = {
        "Administration": "admin",
        "Authentication and Authorization": "authentication",
        "Auth": "auth",
        "Token": "token",
        "Core": "core",
        "Dns": "dns",
        "Guardian": "guardian",
        "Hosts": "hosts",
        "Log": "log",
        "Network": "network",
        "Taggit": "taggit",
        "User": "user",
    };

    return (
        <Paper radius="md" p="lg" m="lg" withBorder>
            <Title order={1} mb="xl">Admin</Title>
            <Text size="md" ta="left">These links are broken on my prod, all the links lead to the home page :/ </Text>
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

export default Admin;
