import { Text, Paper, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { apiCall } from '../../api';
import { useCsrfToken } from '../../hooks/useCsrfToken';



const Welcome = () => {
    // idek if we want username compatability, cuz sometimes is just an Anumber
    const { config } = useConfig();
    const { csrftoken } = useCsrfToken();
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string | null>(null);

    const handleWhoAmI = async () => {
        try {
            const url = `${config.apiUrl}/whoami/`;
            const data = await apiCall(url, 'GET', null, csrftoken);
            if (data.user === null) {
                navigate('/login');
                return;
            }
            const user = data.user.username;
            setUserName(user.charAt(0).toUpperCase() + user.slice(1));
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        handleWhoAmI();
    }, []);

    return (

        <Paper radius="md" p="lg" m="lg" withBorder>
            <Title order={1} mb="xl">Welcome to openIPAM, {userName}</Title>
            <Text size="md" ta="left">Intro para</Text>
            <p>
                We are now using Issues on GitHub to help aid us with features and bugs. Please make an issue on GitHub to give us feedback.
                Item to consider when using the new interface:
                Permissions - Do you have all your permissions?
                Hosts - Do you see all your hosts?
                DNS Entries - Do you see all DNS Entries?
                If you have any questions, please email: openipam@lists.usu.edu
            </p>
        </Paper>
    );
};

export default Welcome;