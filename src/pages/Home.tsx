import { Slider } from '@mantine/core';

const Home = () => {
    return (
        <>
            <div>Home</div>
            <Slider
                defaultValue={40}
                min={10}
                max={90}
                label={null}

            />
        </>
    )
}

export default Home