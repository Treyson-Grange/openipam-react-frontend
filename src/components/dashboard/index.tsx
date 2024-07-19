import Actions from "./Actions";
import Admin from "./Admin";
import Navigation from "./Navigation";
import Stats from "./Stats";
import Welcome from "./Welcome";
import { Grid } from '@mantine/core';
import useAuth from "../../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    if (!auth.results) {
        navigate('/login');
    }
    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Welcome />
                <Navigation />
                <Admin />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Stats />
                <Actions />
            </Grid.Col>
        </Grid>
    );
}

export default DashBoard;
