import { Paper, Title, Button, Text } from '@mantine/core';
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
            <Text>We ask for your patience as we migrate over to our new upgraded design and implementation of openIPAM</Text>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Button onClick={handleLogout} variant='outline' color='red'>Logout</Button>
        </Paper>
    );
};

export default Welcome;