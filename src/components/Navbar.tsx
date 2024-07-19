import { useState } from 'react';
import { Container, Group, Burger, Drawer, Stack, Menu, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import '../styles/index.css';
import logo from '../assets/openIpamLogo.png';

import useAuth from '../hooks/useAuth';

interface DropdownLink {
    link: string;
    label: string;
    dropdown?: { link: string; label: string }[];
}

const links: DropdownLink[] = [
    { link: '/', label: 'Home' },
    { link: '/demo', label: 'Demo' },//Delete
    { link: '/hosts', label: 'Hosts' },
    { link: '/dns', label: 'DNS' },
];

const adminLinks: DropdownLink[] = [
    { link: '/', label: 'Home' },
    {
        link: '/hosts',
        label: 'Hosts',
        dropdown: [
            { label: 'Attributes', link: '/asdf' },
            { label: 'Disabled Hosts', link: '/' },
            { label: 'Expiration Types', link: '/' },
            { label: 'Guest Tickets', link: '/' },
            { label: 'Notifications', link: '/' },
            { label: 'Structured Attribute Values', link: '/' },
        ]
    },
    {
        link: '',
        label: 'DNS',
        dropdown: [
            { label: 'DHCP DNS Records', link: '/' },
            { label: 'DNS Records', link: '/' },
            { label: 'DNS Types', link: '/' },
            { label: 'DNS Views', link: '/' },
            { label: 'Domains', link: '/' },
        ]
    },
    {
        link: '',
        label: 'Network',
        dropdown: [
            { label: 'Addresses', link: '/' },
            { label: 'Address Types', link: '/' },
            { label: 'Buildings', link: '/' },
            { label: 'Building To Vlans', link: '/' },
            { label: 'Default Pools', link: '/' },
            { label: 'DHCP Groups', link: '/' },
            { label: 'DHCP Options', link: '/' },
            { label: 'DHCP Option To DHCP Groups', link: '/' },
            { label: 'Leases', link: '/' },
            { label: 'Networks', link: '/' },
            { label: 'Network Ranges', link: '/' },
            { label: 'Network To Vlans', link: '/' },
            { label: 'Pools', link: '/' },
            { label: 'Shared Networks', link: '/' },
            { label: 'Vlans', link: '/' },
        ]
    },
    {
        link: '',
        label: 'Admin',
        dropdown: [
            { label: 'Users & Groups', link: '/' },
            { label: 'Users', link: '/' },
            { label: 'Groups', link: '/' },
            { label: 'Tokens', link: '/' },
            { label: '', link: '/' },
            { label: '', link: '/' },
        ]
    },
    {
        link: '',
        label: 'Reports',
        dropdown: [
            { label: 'OpenIPAM Stats', link: '/' },
            { label: 'Hardcoded Disabled Hosts', link: '/' },
            { label: 'Exposed Hosts', link: '/' },
            { label: 'Host With No DNS Records', link: '/' },
            { label: 'Broken PTR Records', link: '/' },
            { label: 'Expired Hosts', link: '/' },
            { label: 'Orphaned DNS', link: '/' },
        ]
    },
];

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const auth = useAuth();
    const isAdmin = auth.results?.is_ipamadmin;

    const finalLinks = isAdmin ? adminLinks : links;

    const items = finalLinks.map((link) => (
        <Menu key={link.link} trigger="hover" openDelay={0} closeDelay={10}>
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
            {link.dropdown ? (
                <Menu.Dropdown>
                    {link.dropdown.map((item) => (
                        <Menu.Item
                            key={item.link}
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
            ) : null}
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
