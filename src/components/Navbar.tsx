import {
    Container,
    Group,
    Burger,
    Drawer,
    Stack,
    Menu,
    Title,
    Flex,
    Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';

import '../styles/index.css';
import logo from '../assets/openIpamLogo.png';

import { useAuth } from '../contexts/AuthContext';

interface DropdownLink {
    link?: string;
    label: string;
    isLabel?: boolean;
    dropdown?: { link?: string; label: string; isLabel?: boolean }[];
}
/**
 * Links for regular users.
 */
const links: DropdownLink[] = [
    { link: '/', label: 'Home' },
    { link: '/hosts', label: 'Hosts' },
    { link: '/domains', label: 'Domains' },
];

/**
 * Links for admin users. A LOT of these are gonna get nuked, this is just copy paste from
 * live openipam :/
 */
const adminLinks: DropdownLink[] = [
    { link: '/', label: 'Home' },
    {
        link: '/hosts',
        label: 'Hosts',
        dropdown: [
            { label: 'Attributes', link: '/asdf' },
            { label: 'Disabled Hosts', link: '/1' },
            { label: 'Expiration Types', link: '/2' },
            { label: 'Guest Tickets', link: '/3' },
            { label: 'Notifications', link: '/4' },
            { label: 'Structured Attribute Values', link: '/5' },
        ],
    },
    {
        link: '/domains',
        label: 'Domains',
        dropdown: [
            { label: 'DHCP DNS Records', link: '/6' },
            { label: 'DNS Records', link: '/7' },
            { label: 'DNS Types', link: '/8' },
            { label: 'DNS Views', link: '/9' },
            { label: 'Domains', link: '/10' },
        ],
    },
    {
        link: '/network',
        label: 'Network',
        dropdown: [
            { label: 'Addresses', link: '/11' },
            { label: 'Address Types', link: '/12' },
            { label: 'Buildings', link: '/13' },
            { label: 'Building To Vlans', link: '/14' },
            { label: 'Default Pools', link: '/15' },
            { label: 'DHCP Groups', link: '/16' },
            { label: 'DHCP Options', link: '/17' },
            { label: 'DHCP Option To DHCP Groups', link: '/18' },
            { label: 'Leases', link: '/19' },
            { label: 'Networks', link: '/20' },
            { label: 'Network Ranges', link: '/21' },
            { label: 'Network To Vlans', link: '/22' },
            { label: 'Pools', link: '/23' },
            { label: 'Shared Networks', link: '/24' },
            { label: 'Vlans', link: '/25' },
        ],
    },
    {
        link: '/admin',
        label: 'Admin',
        dropdown: [
            { isLabel: true, label: 'Users & Groups' },
            { label: 'Users', link: '/admin/users' },
            { label: 'Groups', link: '/27' },
            { label: 'Tokens', link: '/28' },
            { isLabel: true, label: 'Permissions' },
            { label: 'Permissions', link: '/29' },
            { label: 'User Object Permissions', link: '/30' },
            { label: 'Group Object Permissions', link: '/31' },
            { label: 'Tags', link: '/32' },
            { isLabel: true, label: 'Logs' },
            { label: 'Log Entries', link: '/33' },
            { label: 'Host Logs', link: '/34' },
            { label: 'Email Logs', link: '/35' },
            { label: 'DNS Records Logs', link: '/36' },
            { label: 'Address Logs', link: '/37' },
            { label: 'User Logs', link: '/38' },
        ],
    },
    {
        link: '/reports',
        label: 'Reports',
        dropdown: [
            { label: 'OpenIPAM Stats', link: '/39' },
            { label: 'Hardcoded Disabled Hosts', link: '/40' },
            { label: 'Exposed Hosts', link: '/41' },
            { label: 'Host With No DNS Records', link: '/42' },
            { label: 'Broken PTR Records', link: '/43' },
            { label: 'Expired Hosts', link: '/44' },
            { label: 'Orphaned DNS', link: '/45' },
        ],
    },
];

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const location = useLocation();
    const { isAdmin } = useAuth();

    const currentPath = location.pathname;

    const finalLinks = isAdmin() ? adminLinks : links;

    const items = finalLinks.map((link) => {
        const isActive = link.link
            ? currentPath === link.link ||
              (currentPath.startsWith(link.link) && link.link !== '/')
            : false;

        return (
            <Menu
                key={link.link || link.label}
                trigger="hover"
                openDelay={0}
                closeDelay={10}
            >
                <Menu.Target>
                    <Link
                        to={link.link || '#'}
                        className="link"
                        data-active={isActive ? true : undefined}
                        onClick={() => {
                            if (link.link) {
                                close();
                            }
                        }}
                    >
                        {link.label}
                    </Link>
                </Menu.Target>
                {link.dropdown ? (
                    <Menu.Dropdown>
                        {link.dropdown.map((item) => {
                            const itemActive = item.link
                                ? currentPath === item.link ||
                                  (currentPath.startsWith(item.link) &&
                                      item.link !== '/')
                                : false;

                            return item.isLabel ? (
                                <div key={item.label}>{item.label}</div>
                            ) : (
                                <Menu.Item
                                    key={item.link || item.label}
                                    component={Link}
                                    to={item.link || '#'}
                                    data-active={itemActive ? true : undefined}
                                    onClick={() => {
                                        if (item.link) {
                                            close();
                                        }
                                    }}
                                >
                                    {item.label}
                                </Menu.Item>
                            );
                        })}
                    </Menu.Dropdown>
                ) : null}
            </Menu>
        );
    });

    return (
        <header className="header">
            <Container size="md" className="inner">
                <Group gap={5} visibleFrom="sm">
                    <Link to="/" className="link logo-container">
                        <Flex align="center" gap="xs">
                            <Image
                                src={logo}
                                alt="openIPAM Logo"
                                h="2rem"
                                w="auto"
                            />
                            <Title order={1} size="h2">
                                openIPAM
                            </Title>
                        </Flex>
                    </Link>
                    {items}
                </Group>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                    aria-label="Open Nav Menu"
                />
                <Group gap={5} hiddenFrom="sm">
                    <Link to="/" className="link logo-container">
                        <Flex align="left">
                            <Image
                                src={logo}
                                alt="openIPAM Logo"
                                h="2rem"
                                w="auto"
                                hiddenFrom="sm"
                            />
                            <Title
                                order={3}
                                hiddenFrom="sm"
                                mr={'auto'}
                                ml={'1rem'}
                            >
                                openIPAM
                            </Title>
                        </Flex>
                    </Link>
                </Group>
            </Container>
            <Drawer
                opened={opened}
                onClose={close}
                title="openIPAM"
                padding="md"
                size="xs"
            >
                <Stack>{items}</Stack>
            </Drawer>
        </header>
    );
}

export default Navbar;
