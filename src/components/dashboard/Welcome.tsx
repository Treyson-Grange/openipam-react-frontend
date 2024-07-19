import { Paper, Title } from '@mantine/core';

const Welcome = () => {
    return (
        <Paper radius="md" p="lg" m="lg" withBorder>
            <Title order={1} mb="xl">Welcome to openIPAM</Title>
            <p>We are now using <a href='https://github.com/openipam/django-openipam/issues/'>Issues on GitHub</a> to help aid us with features and bugs. Please make an issue on GitHub to give us feedback.</p>
            <p>Item to consider when using the new interface:</p>
            <ul>
                <li>Permissions - Do you have all your permissions?</li>
                <li>Hosts - Do you see all your hosts?</li>
                <li>DNS Entries - Do you see all DNS Entries?</li>
            </ul>
            <p>If you have any questions, please email: <a href='mailto:openipam@lists.usu.edu'>openipam@lists.usu.edu</a></p>
        </Paper>
    );
};

export default Welcome;