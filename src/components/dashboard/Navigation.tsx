import { Text, Container, Paper, Title } from '@mantine/core';


const Navigation = () => {
    return (
        <Container size="xl" mt="xl">
            <Paper radius="md" p="lg" withBorder>
                <Title order={1} mb="xl">Navigation</Title>
                <Text size="md" ta="left">Text</Text>
            </Paper>
        </Container>
    );
};

export default Navigation;