import {
    Title,
    Stack,
    Text,
    Flex,
    ActionIcon,
    Card,
    Group,
} from '@mantine/core';
import { Fa1, Fa2, Fa3 } from 'react-icons/fa6';
const PageNotFound = () => {
    return (
        <>
            <Stack align="center">
                <Title>404 - Page Not Found</Title>
                <Text>
                    Uh oh! Seems like there's nothing here. If you think this is
                    a mistake, follow these steps!
                </Text>
            </Stack>
            <Flex justify="center" align="center" direction="row" wrap="wrap">
                <Card m="xl" radius="xl">
                    <Card.Section>
                        <Group justify="center" m="xl">
                            <ActionIcon size="xl">
                                <Fa1 />
                            </ActionIcon>
                            <Title>Refresh the page</Title>
                        </Group>
                    </Card.Section>
                    <Stack align="center">
                        <Text ta="center">
                            Sometimes if you type in a URL, there might be a
                            typo. Try reaching this page from the navigation
                            bar.
                        </Text>
                    </Stack>
                </Card>
                <Card m="xl" radius="xl">
                    <Card.Section>
                        <Group justify="center" m="xl">
                            <ActionIcon size="xl">
                                <Fa2 />
                            </ActionIcon>
                            <Title>Reach out!</Title>
                        </Group>
                    </Card.Section>
                    <Stack align="center">
                        <Text ta="center">
                            Reach out to our Slack channel and ask for help! We
                            will be sure to aid you as soon as possible. See the
                            #networking channel.
                        </Text>
                    </Stack>
                </Card>
                <Card m="xl" radius="xl">
                    <Card.Section>
                        <Group justify="center" m="xl">
                            <ActionIcon size="xl">
                                <Fa3 />
                            </ActionIcon>
                            <Title>Fill out an issue</Title>
                        </Group>
                    </Card.Section>
                    <Stack align="center">
                        <Text ta="center">
                            If nothing works, and you suspect a larger issue, go
                            here and fill out a issue. Be sure to include your
                            exact steps to reproduce the issue. A dev will get
                            back to you as soon as possible.
                        </Text>
                    </Stack>
                </Card>
            </Flex>
        </>
    );
};

export default PageNotFound;
