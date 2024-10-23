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
    /**
     * Link to navigate to on click.
     */
    link?: string;
    /**
     * Label to display.
     */
    label: string;
    /**
     * If true, it will create a label, not a clickable link.
     */
    isLabel?: boolean;
    /**
     * Array of dropdown links. If provided, it will create a dropdown.
     * If you want to create a label in the dropdown, set "isLabel" to true.
     * ex: { label: 'Users', isLabel: true }
     */
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
 * Links for admin users
 * You can add "labels" to the dropdowns by setting the "isLabel" property to true. ex: { label: 'Users', isLabel: true }
 */
const adminLinks: DropdownLink[] = [
    { link: '/', label: 'Home' },
    {
        link: '/hosts',
        label: 'Hosts',
    },
    {
        link: '/domains',
        label: 'Domains',
    },
    {
        link: '/network',
        label: 'Network',
    },
    {
        link: '/admin',
        label: 'Admin',
        dropdown: [{ label: 'Users', link: '/admin/users' }],
    },
    {
        link: '/reports',
        label: 'Reports',
    },
];

/**
 * Navbar component uses isAdmin to determine which links to display. User will have to re login to see changes if their perms change.
 * @returns Navbar component
 */
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
