import { useState } from 'react';
import { Container, Group, Burger, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import '../styles/index.css';

const links = [
    { link: '/', label: 'Home' },
    { link: '/demo', label: 'Demo' },
];

export function HeaderSimple() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <Link
            key={link.label}
            to={link.link} // Use 'to' instead of 'href'
            className="link"
            data-active={active === link.link || undefined}
            onClick={() => {
                setActive(link.link);
                close();
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <header className="header">
            <Container size="md" className="inner">
                <Group gap={5} visibleFrom="xs">
                    {items}
                </Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Container>
            <Drawer
                opened={opened}
                onClose={close}
                title="Menu"
                padding="md"
                size="xs"
            >
                <Stack>
                    {items}
                </Stack>
            </Drawer>
        </header>
    );
}

export default HeaderSimple;
