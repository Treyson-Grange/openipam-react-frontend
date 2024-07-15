import Actions from "./Actions";
import Admin from "./Admin";
import Navigation from "./Navigation";
import Stats from "./Stats";
import Welcome from "./Welcome";


import { Grid } from '@mantine/core';

const DashBoard = () => {
    return (
        <>
            <Grid grow>
                <Grid.Col span={6}>
                    <Welcome />
                    <Navigation />
                    <Admin />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Stats />
                    <Actions />
                </Grid.Col>
            </Grid>
        </>
    );
}

export default DashBoard;