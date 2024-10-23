import { Grid } from '@mantine/core';
import { Actions, Welcome, Stats, UserHosts } from '../components/dashboard';

/**
 * The home page of the application.
 * Note for you. Yes you. This home screen is a general copy of the home screen on live openipam.
 * As such, you should redesign it.
 */
const Home = () => {
    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 12 }}>
                <Welcome />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 6 }}>
                <Actions />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 6 }}>
                <Stats />
                <UserHosts />
            </Grid.Col>
        </Grid>
    );
};

export default Home;
