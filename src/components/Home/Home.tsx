import { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { apiCall } from '../../api';
import { useCsrfToken } from '../../hooks/useCsrfToken';

const Home = (): JSX.Element => {
    const navigate = useNavigate();
    const { config } = useConfig();
    const csrftoken = useCsrfToken();
    const [userName, setUserName] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            const url = `${config.apiUrl}/logout/`;
            const data = await apiCall(url, 'POST', null, csrftoken);
            console.log(data);
            navigate('/login')
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleWhoAmI = async () => {
        try {
            const url = `${config.apiUrl}/whoami/`;
            const data = await apiCall(url, 'GET', null, csrftoken);
            if (data.user === null) {
                navigate('/login')
                return;
            }
            console.log("Who Am I", data.user.username)
            setUserName(data.user.username);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        handleWhoAmI();
    }, []);

    return (
        <>
            <div>Welcome Home</div>
            {userName && <div>Hello, {userName}!</div>}
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={handleLogout}
                disabled={!csrftoken}
            >
                Logout
            </Button>
            <Button
                variant="light"
                radius="xl"
                size="md"
                onClick={handleWhoAmI}
                disabled={!csrftoken}
            >
                Who Am I
            </Button>
        </>
    );
};

export default Home;
