import { useEffect } from 'react';
import { Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Actions from './Actions';
import Stats from './Stats';
import Welcome from './Welcome';
import UserHosts from './UserHosts';

const DashBoard = () => {
    const { user } = useAuth();
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
            <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 6 }}>
                <Welcome />
                <Actions />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 6 }}>
                <Stats />
                <UserHosts />
            </Grid.Col>
        </Grid>
    );
};

export default DashBoard;
