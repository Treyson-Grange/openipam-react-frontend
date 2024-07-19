import { useState } from 'react';
import { Container, Group, Burger, Drawer, Stack, Menu, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import '../styles/index.css';
import logo from '../assets/openIpamLogo.png';

import useAuth from '../hooks/useAuth';

const links = [
    { link: '/', label: 'Home', dropdown: [{ label: 'Submenu 1', link: '/submenu1' }, { label: 'Submenu 2', link: '/submenu2' }] },
    { link: '/demo', label: 'Demo', dropdown: [{ label: 'Submenu A', link: '/submenuA' }, { label: 'Submenu B', link: '/submenuB' }] },
    { link: '/hosts', label: 'Hosts', dropdown: [{ label: 'Attributes', link: '/hosts/attributes' }, { label: 'Disabled Hosts', link: '/hosts/disabled' }] },
];

const adminLinks = [
    { link: '/admin', label: 'Admin', dropdown: [{ label: 'Submenu 3', link: '/submenu3' }, { label: 'Submenu 4', link: '/submenu4' }] },
    { link: '/admin2', label: 'Admin2', dropdown: [{ label: 'Submenu 5', link: '/submenu5' }, { label: 'Submenu 6', link: '/submenu6' }] },
];

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const auth = useAuth();
    const isAdmin = auth.results?.is_ipamadmin;

    // Create finalLinks based on user role
    const finalLinks = isAdmin ? [...links, ...adminLinks] : links;

    const items = finalLinks.map((link) => (
        <Menu key={link.label} trigger="hover" openDelay={0} closeDelay={10}>
            <Menu.Target>
                <Link
                    to={link.link}
                    className="link"
                    data-active={active === link.link || undefined}
                    onClick={() => {
                        setActive(link.link);
                        close();
                    }}
                >
                    {link.label}
                </Link>
            </Menu.Target>
            <Menu.Dropdown>
                {link.dropdown.map((item) => (
                    <Menu.Item
                        key={item.label}
                        component={Link}
                        to={item.link}
                        onClick={() => {
                            setActive(item.link);
                            close();
                        }}
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    ));

    return (
        <header className="header">
            <Container size="md" className="inner">
                <Group gap={5} visibleFrom="xs">
                    <Link to="/" className="link logo-container" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" className="logo" style={{ height: "2rem" }} />
                        <span className="logo-title" style={{ marginLeft: "0.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>openIPAM</span>
                    </Link>
                    {items}
                </Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
                <Title order={3} hiddenFrom="xs" style={{ marginRight: 'auto', marginLeft: '1rem' }}>
                    openIPAM
                </Title>
            </Container>
            <Drawer
                opened={opened}
                onClose={close}
                title="openIPAM"
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

export default Navbar;
