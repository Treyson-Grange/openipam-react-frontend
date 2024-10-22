import { Grid } from '@mantine/core';
import Actions from './Actions';
import Stats from './Stats';
import Welcome from './Welcome';
import UserHosts from './UserHosts';

const DashBoard = () => {
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

export default DashBoard;
