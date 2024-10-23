import { Paper, Title, Button, Text, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Displays a welcome message to the user.
 */
const Welcome = () => {
    const { user, logout } = useAuth();
    const api = getApiEndpointFunctions();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            api.auth.logout();
            logout();
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error(
                'There was a problem with the logout operation',
                error,
            );
        }
    };

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Title order={1} mb="xl">
                Welcome to openIPAM
                {user?.first_name ? `, ${user.first_name}` : ''}
            </Title>
            <Stack align="flex-start">
                <Text>
                    We ask for your patience as we migrate over to our new
                    upgraded design and implementation of openIPAM.
                </Text>
                <Text>
                    Please reach out to the IPAM team if you have any questions
                    or concerns.
                </Text>
                <Button onClick={handleLogout} variant="outline" color="red">
                    Logout
                </Button>
            </Stack>
        </Paper>
    );
};

export default Welcome;
