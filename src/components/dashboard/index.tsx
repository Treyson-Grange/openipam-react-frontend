import { useEffect } from 'react';
import { Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Actions from './Actions';
import Admin from './Admin';
import Navigation from './Navigation';
import Stats from './Stats';
import Welcome from './Welcome';

const DashBoard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Welcome />
                <Navigation />
                {isAdmin() && <Admin />}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Stats />
                <Actions />
            </Grid.Col>
        </Grid>
    );
};

export default DashBoard;
