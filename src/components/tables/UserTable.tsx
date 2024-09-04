import { useState, useEffect } from 'react';
import { PaginatedData } from '../../types/api';
import { usePaginatedApi } from '../../hooks/useApi';
import { QueryRequest } from '../../utilities/apiFunctions';
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
    Tooltip,
    Flex,
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
    FaPencil,
} from 'react-icons/fa6';
import { useDebouncedValue } from '@mantine/hooks';

interface BaseUserTableProps {
    /**
     * The GET function defined in /utilities/apiFunctions.ts used to get the data.
     */
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    /**
     * The default page size to use for the table. Defaults to 5.
     */
    defPageSize?: number;
    /**
     * The title of the table.
     */
    title: string;
    /**
     * The message to display when there is no data.
     */
    noDataMessage?: string;
    /**
     * Whether to highlight the dates in the table.
     * Defaults to false.
     * Green if the date is in the future, red if the date is in the past. (useful for expiration)
     */
    highlightDates?: boolean;
    /**
     * The attributes from the API to display in the table.
     */
    neededAttr: string[];
    /**
     * Additional page sizes to display in the page size dropdown.
     */
    morePageSizes?: string[];
    /**
     * Whether to override the default page sizes with the additional page sizes.
     * Requires `morePageSizes` to be set.
     */
    overridePageSizes?: boolean;
    /**
     * Whether the objects in the table are sortable.
     * Sortability depends on API support. In the Django API, you must alter the
     * View or viewset. In the filter_queryset function, we will get queryparams;
     * `order_by` and `direction` and sort the queryset accordingly.
     *
     * For a quick example, see openipam/api_v2/views/logs.py, lines 47-55.
     */
    sortable?: boolean;
    /**
     * The fields that are sortable.
     * Most fields will end up being sortable if the API is set up correctly, but
     * proceed with caution.
     */
    sortableFields?: string[];
    /**
     * Whether the objects in the table are searchable
     * Requires `searchableFields` to be set.
     * Searchability depends on API support. In the Django API, you must alter the
     * View. To do so, you must obtain the query parameters for the searchable fields, and
     * filter the queryset accordingly.
     *
     * For a quick example, see openipam/api_v2/views/users, lines 60-72.
     */
    searchable?: boolean;
    /**
     * The fields that are searchable.
     * Requires `searchable` to be set.
     * All searchable fields need to be set up in the API. They won't just work.
     */
    searchableFields?: string[];
    /**
     * The additional URL parameters to pass to the API.
     * Pass it in like *additionalUrlParams={{ "paramName": String(value)) }}*
     *
     * There are no current use cases for this. But it can be used to pass in additional
     * parameters to the get function of the API.
     */
    additionalUrlParams?: Record<string, string>;
}

interface EditableUserTableProps extends BaseUserTableProps {
    /**
     * Whether the objects in the table are editable.
     *
     * DO not set this to true if you dont have at least one of the following:
     * - 'actions' and 'actionFunctions'
     * - 'editFunction' and 'editableFields'
     */
    editableObj: true;
    /**
     * The actions that can be performed on the objects in the table.
     * To have actions, both `actions` and `actionFunctions` must be set.
     */
    actions?: string[];
    /**
     * The functions to call when an action is performed.
     * To have actions, both `actions` and `actionFunctions` must be set.
     * Please pass func and key, where the key is the attribute to pass to the function.
     * functionName: { func: (id: number) => console.log(`Editing group ${id}`), key: 'id' },
     *      OR
     * functionName: { func: previouslyDefinedFunction, key: 'id' }
     */
    actionFunctions?: Record<
        string,
        { func: (params: any) => void; key: string }
    >;
    /**
     * The PUT function defined in /utilities/apiFunctions.ts used to edit the data.
     * The way you pass the function is a bit different. See the example in DomainDetail.tsx.
     * Requires `editableObj` to be true.
     */
    editFunction?: (dnsName: string) => QueryRequest<any, any>;
    /**
     * The editable fields
     */
    editableFields?: string[];
}

interface NonEditableUserTableProps extends BaseUserTableProps {
    /**
     * Whether the objects in the table are editable. Defaults to false.
     */
    editableObj?: false;
}

type UserTableProps = EditableUserTableProps | NonEditableUserTableProps;

/**
 * This sucks.
 */
const UserTable = (props: UserTableProps): JSX.Element => {
    const actions = (props as EditableUserTableProps).actions ?? [];
    const actionFunctions =
        (props as EditableUserTableProps).actionFunctions ?? {};
    const editFunction = (props as EditableUserTableProps).editFunction;
    const editableFields = (props as EditableUserTableProps).editableFields;
    const {
        getFunction,
        defPageSize,
        title,
        neededAttr,
        morePageSizes,
        overridePageSizes,
        highlightDates,
        editableObj,
        sortable,
        sortableFields,
        searchable,
        searchableFields,
        additionalUrlParams,
    } = props;
    const [data, setData] = useState<any[]>([]);
    const [noDataMessage] = useState<string | undefined>(
        props.noDataMessage || 'No data found',
    );
    const [maxPages, setMaxPages] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defPageSize || 5);
    const [page, setPage] = useState<number>(1);
    const [selectedObjs, setSelectedObjs] = useState<Set<any>>(new Set());
    const [notification, setNotification] = useState<string[] | null>(null);
    const [action, setAction] = useState<string>(actions[0] ?? '');
    const [orderBy, setOrderBy] = useState<string>('');
    const [direction, setDirection] = useState<string>('asc');
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [debounce] = useDebouncedValue(searchTerms, 200);
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const [reload, setReload] = useState<boolean>(false);

    const { data: paginatedData, loading } = usePaginatedApi(
        getFunction,
        page,
        pageSize,
        {
            ...(orderBy ? { [orderBy]: direction } : {}),
            ...Object.fromEntries(
                Object.entries(debounce).filter(([_, v]) => v),
            ),
            ...(reload && { reload: 'true' }),
            ...additionalUrlParams,
        },
    );

    const pageSizes = ['5', '10', '20'];
    if (overridePageSizes) {
        pageSizes.length = 0;
    }

    if (morePageSizes) {
        const uniqueSizes = new Set([...pageSizes, ...morePageSizes]);
        pageSizes.length = 0;
        pageSizes.push(
            ...Array.from(uniqueSizes).sort(
                (a, b) => parseInt(a) - parseInt(b),
            ),
        );
    }

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
        if (!sortable) return;
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

    const handleEditClick = (item: any) => {
        setEditingRow(item.id);
        setEditValues(
            editableFields?.reduce(
                (acc, field) => {
                    acc[field] = item[field] || '';
                    return acc;
                },
                {} as Record<string, string>,
            ) || {},
        );
    };

    const handleEditInputChange = (field: string, value: string) => {
        setEditValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    const handleEditSubmit = async (item: any) => {
        try {
            if (editFunction) {
                const updateFunction = editFunction(item.id);
                await updateFunction(editValues);
                setNotification(['Edit submitted successfully', 'Success']);
                setEditingRow(null);
                setReload((prev) => !prev);
            }
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
                    <Title>{title}</Title>
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
                        {editableObj && actions.length && (
                            <col style={{ width: '5%' }} />
                        )}
                        {neededAttr.map((attr) => (
                            <col
                                key={attr}
                                style={{ width: `${90 / neededAttr.length}%` }}
                            />
                        ))}
                    </colgroup>
                    <Table.Thead>
                        <Table.Tr>
                            {editableObj && actions.length !== 0 && (
                                <Table.Th></Table.Th>
                            )}
                            {neededAttr.map((attr) => (
                                <Table.Th key={attr} ta="left">
                                    <Group gap="xs">
                                        <Text>{handleFormatHeader(attr)}</Text>
                                        {sortable &&
                                            sortableFields?.includes(attr) && (
                                                <ActionIcon
                                                    aria-label="Sort"
                                                    variant="subtle"
                                                    onClick={() =>
                                                        handleSort(
                                                            attr,
                                                            direction,
                                                        )
                                                    }
                                                >
                                                    {orderBy === attr ? (
                                                        direction ===
                                                        'false' ? (
                                                            <FaSortUp />
                                                        ) : (
                                                            <FaSortDown />
                                                        )
                                                    ) : (
                                                        <FaSort />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        {searchable &&
                                            searchableFields?.includes(
                                                attr,
                                            ) && (
                                                <TextInput
                                                    placeholder={`Search ${handleFormatHeader(attr)}`}
                                                    value={
                                                        searchTerms[attr] || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleSearchChange(
                                                            attr,
                                                            e.currentTarget
                                                                .value,
                                                        )
                                                    }
                                                    size="xs"
                                                />
                                            )}
                                    </Group>
                                </Table.Th>
                            ))}
                            {editableObj && editFunction && (
                                <Table.Th>Edit</Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.length === 0 ? (
                            <Table.Tr>
                                <Table.Td
                                    colSpan={
                                        neededAttr.length +
                                        (editableObj ? 1 : 0)
                                    }
                                >
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
                                const isEditing = editingRow === item.id;
                                return (
                                    <Table.Tr key={item.id}>
                                        {editableObj && actions.length > 0 && (
                                            <Table.Td>
                                                <Checkbox
                                                    checked={Array.from(
                                                        selectedObjs,
                                                    ).some(
                                                        (obj) =>
                                                            obj.id === item.id,
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
                                        )}
                                        {neededAttr.map((attr) => {
                                            const value = item[attr];
                                            const dateRegex =
                                                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}:\d{2}|Z)?$/;
                                            const isDate =
                                                dateRegex.test(value);

                                            const isBoolean =
                                                typeof value === 'boolean';
                                            const pastOrFuture =
                                                new Date(value) < new Date();

                                            return (
                                                <Table.Td key={attr}>
                                                    {isEditing &&
                                                    editableFields?.includes(
                                                        attr,
                                                    ) ? (
                                                        <TextInput
                                                            value={
                                                                editValues[attr]
                                                            }
                                                            onChange={(e) =>
                                                                handleEditInputChange(
                                                                    attr,
                                                                    e
                                                                        .currentTarget
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    ) : isDate ? (
                                                        highlightDates ? (
                                                            <Text
                                                                c={
                                                                    pastOrFuture
                                                                        ? 'red'
                                                                        : 'green'
                                                                }
                                                            >
                                                                {handleFormatDate(
                                                                    value,
                                                                )}
                                                            </Text>
                                                        ) : (
                                                            handleFormatDate(
                                                                value,
                                                            )
                                                        )
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
                                        {editableObj && editFunction && (
                                            <Table.Td>
                                                <Flex justify="left">
                                                    {isEditing ? (
                                                        <>
                                                            <Tooltip label="Submit Changes">
                                                                <ActionIcon
                                                                    aria-label="Submit Changes"
                                                                    size={'lg'}
                                                                    mr={8}
                                                                    color="green"
                                                                    onClick={() =>
                                                                        handleEditSubmit(
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <FaCheck />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Cancel Changes">
                                                                <ActionIcon
                                                                    aria-label="Cancel Changes"
                                                                    size={'lg'}
                                                                    color="red"
                                                                    onClick={() => {
                                                                        setEditingRow(
                                                                            null,
                                                                        );
                                                                        setEditValues(
                                                                            {},
                                                                        );
                                                                    }}
                                                                >
                                                                    <FaXmark />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <Tooltip label="Edit">
                                                            <ActionIcon
                                                                aria-label="Edit"
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        item,
                                                                    )
                                                                }
                                                                size={'lg'}
                                                            >
                                                                <FaPencil />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    )}
                                                </Flex>
                                            </Table.Td>
                                        )}
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

                    {editableObj && actions.length > 0 && (
                        <Select
                            data={actions}
                            value={action}
                            onChange={handleActionChange}
                        />
                    )}
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
                {editableObj && actions.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            disabled={selectedObjs.size === 0}
                            onClick={() => setSelectedObjs(new Set())}
                            color="#8d0d20"
                        >
                            Clear Selection{' '}
                            {selectedObjs.size !== 0 &&
                                `(${selectedObjs.size})`}
                        </Button>
                        <Button
                            onClick={submitChange}
                            disabled={selectedObjs.size === 0}
                            color="blue"
                        >
                            Submit
                        </Button>
                    </div>
                )}
            </Group>
        </Paper>
    );
};

export default UserTable;