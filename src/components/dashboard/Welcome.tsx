import { Paper, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { apiCall } from '../../api';
import { useCsrfToken } from '../../hooks/useCsrfToken';



const Welcome = () => {
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