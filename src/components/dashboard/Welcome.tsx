import { Paper, Title, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import { useAuth } from '../../contexts/AuthContext';

const Welcome = () => {
    const { logout } = useAuth();
    const api = getApiEndpointFunctions();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            api.auth.logout();
            logout();
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('There was a problem with the logout operation', error);
        }
    }

    return (
        <Paper radius='lg' p='lg' m='lg' withBorder >
            <Title order={1} mb='xl'>Welcome to openIPAM</Title>
            <p>We are now using <a href='https://github.com/openipam/django-openipam/issues/'>Issues on GitHub</a> to help aid us with features and bugs. Please make an issue on GitHub to give us feedback.</p>
            <p>Item to consider when using the new interface:</p>
            <ul>
                <li>Permissions - Do you have all your permissions?</li>
                <li>Hosts - Do you see all your hosts?</li>
                <li>DNS Entries - Do you see all DNS Entries?</li>
            </ul>
            <p>If you have any questions, please email: <a href='mailto:openipam@lists.usu.edu'>openipam@lists.usu.edu</a></p>
            <Button onClick={handleLogout} variant='outline' color='red'>Logout</Button>
        </Paper>
    );
};

export default Welcome;