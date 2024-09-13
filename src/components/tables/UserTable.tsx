import { useState, useEffect } from 'react';
import { usePaginatedApi } from '../../hooks/useApi';
import {
    Button,
    Paper,
    Title,
    Table,
    Text,
    Select,
    Group,
    Checkbox,
    Notification,
    Dialog,
    Pagination,
    TextInput,
    ActionIcon,
    ThemeIcon,
    Loader,
} from '@mantine/core';
import {
    FaRegCircleXmark,
    FaRegCircleCheck,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaCheck,
    FaXmark,
} from 'react-icons/fa6';
import { useDebouncedValue } from '@mantine/hooks';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';

type ActionFunctions = Record<
    string,
    { func: (params: any) => void; key: string }
>;

const UserTable = (): JSX.Element => {
    const api = getApiEndpointFunctions();
    const getFunction = api.users.get;

    const test = (id: any) => {
        console.log(id);
    };

    const actions = [
        'Assign Groups to users',
        'Remove Groups from users',
        'Assign Object Permissions to users',
        'Populate User from LDAP',
    ];
    const actionFunctions: ActionFunctions = {
        AssignGroupstousers: { func: test, key: 'id' },
        edit: { func: test, key: 'id' },
        delete: { func: test, key: 'id' },
    };

    const neededAttr = [
        'username',
        'email',
        'full_name',
        'is_active',
        'is_staff',
        'is_ipamadmin',
        'is_superuser',
        'source',
        'last_login',
    ];
    const sortableFields = [
        'is_active',
        'is_staff',
        'is_ipamadmin',
        'is_superuser',
    ];
    const searchableFields = ['username', 'email', 'full_name'];

    const [data, setData] = useState<any[]>([]);
    const [noDataMessage] = useState<string | undefined>('No users found');
    const [maxPages, setMaxPages] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [selectedObjs, setSelectedObjs] = useState<Set<any>>(new Set());
    const [notification, setNotification] = useState<string[] | null>(null);
    const [action, setAction] = useState<string>(actions[0] ?? '');
    const [orderBy, setOrderBy] = useState<string>('');
    const [direction, setDirection] = useState<string>('asc');
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [debounce] = useDebouncedValue(searchTerms, 200);

    const { data: paginatedData, loading } = usePaginatedApi(
        getFunction,
        page,
        pageSize,
        {
            ...(orderBy ? { [orderBy]: direction } : {}),
            ...Object.fromEntries(
                Object.entries(debounce).filter(([_, v]) => v),
            ),
        },
    );

    const pageSizes = ['25', '50', '100', '250'];

    const handlePageSizeChange = (value: string | null) => {
        setPage(1);
        setPageSize(parseInt(value || '5'));
    };

    const handleSearchChange = (field: string, value: string) => {
        setSearchTerms((prevTerms) => ({ ...prevTerms, [field]: value }));
    };

    const handleActionChange = (value: string | null) => {
        if (value) {
            setAction(value);
        }
    };

    const handleSort = (key: string, oldDirection: string) => {
        let newDirection = 'false';
        if (key === orderBy) {
            newDirection = oldDirection === 'false' ? 'true' : 'false';
        }
        setDirection(newDirection);
        setOrderBy(key);
    };

    const handleFormatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const optionsDate: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return `${date.toLocaleDateString('en-US', optionsDate)} ${date.toLocaleTimeString('en-US', optionsTime)}`;
    };

    const handleFormatHeader = (header: string) =>
        header
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase());

    const handleCheckboxChange = (item: any, checked: boolean) => {
        setSelectedObjs((prevSelectedObjs) => {
            const updatedSelectedObjs = new Set(prevSelectedObjs);
            if (checked) {
                updatedSelectedObjs.add(item);
            } else {
                updatedSelectedObjs.delete(item);
            }
            return updatedSelectedObjs;
        });
    };

    const submitChange = () => {
        const actionObj = actionFunctions[action.replace(/\s/g, '')];
        if (!actionObj) {
            setNotification(['Error: Invalid action', 'Error']);
            return;
        }

        const { func, key } = actionObj;

        try {
            selectedObjs.forEach((selectedItem) => {
                const value = selectedItem[key];
                func(value);
            });

            setNotification(['Changes submitted successfully', 'Success']);
        } catch (error) {
            setNotification([`${error}`, 'Error']);
        }
    };

    useEffect(() => {
        if (paginatedData && paginatedData.results) {
            setData(paginatedData.results);
            setMaxPages(Math.ceil(paginatedData.count / pageSize));
        }
    }, [paginatedData, pageSize, orderBy, direction]);

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                <Group mb="lg" justify="space-between">
                    <Title>Users</Title>
                    {loading && <Loader size={30} />}
                </Group>
                {maxPages !== 1 && (
                    <Pagination
                        mb="lg"
                        total={maxPages}
                        value={page}
                        onChange={setPage}
                    />
                )}
            </Group>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        {neededAttr.map((attr) => (
                            <col
                                key={attr}
                                style={{ width: `${90 / neededAttr.length}%` }}
                            />
                        ))}
                    </colgroup>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th></Table.Th>
                            {neededAttr.map((attr) => (
                                <Table.Th key={attr} ta="left">
                                    <Group gap="xs">
                                        <Text>{handleFormatHeader(attr)}</Text>
                                        {sortableFields?.includes(attr) && (
                                            <ActionIcon
                                                aria-label="Sort"
                                                variant="subtle"
                                                onClick={() =>
                                                    handleSort(attr, direction)
                                                }
                                            >
                                                {orderBy === attr ? (
                                                    direction === 'false' ? (
                                                        <FaSortUp />
                                                    ) : (
                                                        <FaSortDown />
                                                    )
                                                ) : (
                                                    <FaSort />
                                                )}
                                            </ActionIcon>
                                        )}
                                        {searchableFields?.includes(attr) && (
                                            <TextInput
                                                placeholder={`Search ${handleFormatHeader(attr)}`}
                                                value={searchTerms[attr] || ''}
                                                onChange={(e) =>
                                                    handleSearchChange(
                                                        attr,
                                                        e.currentTarget.value,
                                                    )
                                                }
                                                size="xs"
                                            />
                                        )}
                                    </Group>
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={neededAttr.length + 1}>
                                    <Text mt="xl" size="xl">
                                        {loading
                                            ? 'Loading...'
                                            : data.length === 0
                                              ? noDataMessage
                                              : null}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            data.map((item: any) => {
                                return (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>
                                            <Checkbox
                                                checked={Array.from(
                                                    selectedObjs,
                                                ).some(
                                                    (obj) => obj.id === item.id,
                                                )}
                                                onChange={(event) =>
                                                    handleCheckboxChange(
                                                        item,
                                                        event.currentTarget
                                                            .checked,
                                                    )
                                                }
                                            />
                                        </Table.Td>
                                        {neededAttr.map((attr) => {
                                            const value = item[attr];
                                            const dateRegex =
                                                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}:\d{2}|Z)?$/;
                                            const isDate =
                                                dateRegex.test(value);

                                            const isBoolean =
                                                typeof value === 'boolean';

                                            return (
                                                <Table.Td key={attr}>
                                                    {isDate ? (
                                                        <Text>
                                                            {handleFormatDate(
                                                                value,
                                                            )}
                                                        </Text>
                                                    ) : isBoolean ? (
                                                        value ? (
                                                            <ThemeIcon color="#2e2e2e">
                                                                <FaCheck color="green" />
                                                            </ThemeIcon>
                                                        ) : (
                                                            <ThemeIcon color="#2e2e2e">
                                                                <FaXmark color="red" />
                                                            </ThemeIcon>
                                                        )
                                                    ) : (
                                                        value
                                                    )}
                                                </Table.Td>
                                            );
                                        })}
                                    </Table.Tr>
                                );
                            })
                        )}
                    </Table.Tbody>
                </Table>
            </div>
            <Group
                mt="md"
                ml="sm"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', gap: '10px' }}>
                    {data.length >= +pageSizes[0] && (
                        <Select
                            style={{ maxWidth: '80px', textAlign: 'center' }}
                            data={pageSizes}
                            value={pageSize.toString()}
                            onChange={handlePageSizeChange}
                        />
                    )}
                    <Select
                        data={actions}
                        value={action}
                        onChange={handleActionChange}
                    />
                </div>
                {notification && (
                    <Dialog opened={notification != null} size="xl">
                        <Notification
                            title={notification?.[0]}
                            icon={
                                notification?.[1] === 'Success' ? (
                                    <FaRegCircleCheck />
                                ) : (
                                    <FaRegCircleXmark />
                                )
                            }
                            color={
                                notification?.[1] === 'Success'
                                    ? 'green'
                                    : 'red'
                            }
                            onClose={() => setNotification(null)}
                        />
                    </Dialog>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        disabled={selectedObjs.size === 0}
                        onClick={() => setSelectedObjs(new Set())}
                        color="#8d0d20"
                    >
                        Clear Selection{' '}
                        {selectedObjs.size !== 0 && `(${selectedObjs.size})`}
                    </Button>
                    <Button
                        onClick={submitChange}
                        disabled={selectedObjs.size === 0}
                        color="blue"
                    >
                        Submit
                    </Button>
                </div>
            </Group>
        </Paper>
    );
};

export default UserTable;
