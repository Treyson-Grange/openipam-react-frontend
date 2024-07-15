import { Text, Container, Paper, Title } from '@mantine/core';


const Admin = () => {
    return (
        <Container size="xl" mt="xl">
            <Paper radius="md" p="lg" withBorder>
                <Title order={1} mb="xl">Admin</Title>
                <Text size="md" ta="left">This is broken on my prod, all the links lead to the home page ;/ </Text>
            </Paper>
        </Container>
    );
};

export default Admin;