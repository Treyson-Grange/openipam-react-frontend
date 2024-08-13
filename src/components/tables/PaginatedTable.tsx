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
    Tooltip,
    Flex
} from '@mantine/core';
import {
    FaRegCircleXmark,
    FaRegCircleCheck,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaCheck,
    FaXmark,
    FaPencil
} from 'react-icons/fa6';

interface BasePaginatedTableProps {
    /**
     * The function to call to get the data for the table.
     */
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    /**
     * The default page size to use for the table.
     */
    defPageSize: number;
    /**
     * The title of the table.
     */
    title: string;
    /**
     * The attributes needed to display in the table.
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
     */
    sortable?: boolean;
    /**
     * The fields that are sortable.
     */
    sortableFields?: string[];
    /**
     * Whether the objects in the table are searchable
     * Requires `searchableFields` to be set.
    */
    searchable?: boolean;
    /**
     * The fields that are searchable.
     * Requires `searchable` to be set.
    */
    searchableFields?: string[];
    /**
     * The additional URL parameters to pass to the API.
     * Pass it in like *additionalUrlParams={{ "paramName": String(value)) }}*
    */
    additionalUrlParams?: Record<string, string>;
}

interface EditablePaginatedTableProps extends BasePaginatedTableProps {
    /**
     * Whether the objects in the table are editable.
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
     */
    actionFunctions?: Record<string, { func: (params: any) => void, key: string }>;
    /**
     * The function to call to edit an object in the table.
     * Requires `editableObj` to be
    */
    editFunction?: (dnsName: string) => QueryRequest<any, any>;
    /**
     * The editable fields
     */
    editableFields?: string[];
}

interface NonEditablePaginatedTableProps extends BasePaginatedTableProps {
    /**
     * Whether the objects in the table are editable. Defaults to false.
     */
    editableObj?: false;
}

type PaginatedTableProps = EditablePaginatedTableProps | NonEditablePaginatedTableProps;

const PaginatedTable = (props: PaginatedTableProps): JSX.Element => {
    const actions = (props as EditablePaginatedTableProps).actions ?? [];
    const actionFunctions = (props as EditablePaginatedTableProps).actionFunctions ?? {};
    const editFunction = (props as EditablePaginatedTableProps).editFunction;
    const editableFields = (props as EditablePaginatedTableProps).editableFields;
    const {
        getFunction,
        defPageSize,
        title,
        neededAttr,
        morePageSizes,
        overridePageSizes,
        editableObj,
        sortable,
        sortableFields,
        searchable,
        searchableFields,
        additionalUrlParams
    } = props;
    const [data, setData] = useState<any[]>([]);
    const [maxPages, setMaxPages] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defPageSize);
    const [page, setPage] = useState<number>(1);
    const [selectedObjs, setSelectedObjs] = useState<Set<any>>(new Set());
    const [notification, setNotification] = useState<string[] | null>(null);
    const [action, setAction] = useState<string>(actions[0] ?? '');
    const [orderBy, setOrderBy] = useState<string>('');
    const [direction, setDirection] = useState<string>('asc');
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const pageSizes = ['5', '10', '20'];
    if (overridePageSizes) { pageSizes.length = 0; }

    if (morePageSizes) {
        const uniqueSizes = new Set([...pageSizes, ...morePageSizes]);
        pageSizes.length = 0;
        pageSizes.push(...Array.from(uniqueSizes).sort((a, b) => parseInt(a) - parseInt(b)));
    }

    const handlePageSizeChange = (value: string | null) => {
        setPage(1);
        setPageSize(parseInt(value || '5'));
    };

    const handleSearchChange = (field: string, value: string) => {
        setSearchTerms(prevTerms => ({ ...prevTerms, [field]: value }));
    };

    const { data: paginatedData } = usePaginatedApi(
        getFunction,
        page,
        pageSize,
        {
            ...orderBy ? { 'order_by': orderBy, 'direction': direction } : {},
            ...Object.fromEntries(Object.entries(searchTerms).filter(([_, v]) => v)),
            ...additionalUrlParams
        }
    );

    const handleActionChange = (value: string | null) => {
        if (value) {
            setAction(value);
        }
    };

    const handleSort = (key: string, oldDirection: string) => {
        if (!sortable) return;
        let newDirection = 'asc';
        if (key === orderBy) {
            newDirection = oldDirection === 'asc' ? 'desc' : 'asc';
        }
        setDirection(newDirection);
        setOrderBy(key);
    };

    const handleFormatHeader = (header: string) => header.replace(/[_-]/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());

    const handleCheckboxChange = (item: any, checked: boolean) => {
        setSelectedObjs(prevSelectedObjs => {
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
        setEditValues(editableFields?.reduce((acc, field) => {
            acc[field] = item[field] || '';
            return acc;
        }, {} as Record<string, string>) || {});
    };

    const handleEditInputChange = (field: string, value: string) => {
        setEditValues(prevValues => ({ ...prevValues, [field]: value }));
    };

    const handleEditSubmit = async (item: any) => {
        try {
            if (editFunction) {
                const updateFunction = editFunction(item.id);
                await updateFunction(editValues);
                setNotification(['Edit submitted successfully', 'Success']);
                setEditingRow(null);
            }
        } catch (error) {
            setNotification([`Error: ${error}`, 'Error']);
        }
    };


    useEffect(() => {
        if (paginatedData && paginatedData.results) {
            setData(paginatedData.results);
            setMaxPages(Math.ceil(paginatedData.count / pageSize));
        }
    }, [paginatedData, pageSize, orderBy, direction]);

    return (
        <Paper radius='lg' p='lg' m='lg' withBorder>
            <Group justify='space-between'>
                <Title>{title}</Title>
                {maxPages !== 1 &&
                    <Pagination total={maxPages} value={page} onChange={setPage} />
                }
            </Group>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table>
                    <colgroup>
                        {editableObj && actions.length && <col style={{ width: '5%' }} />}
                        {neededAttr.map(attr => (
                            <col key={attr} style={{ width: `${90 / neededAttr.length}%` }} />
                        ))}
                    </colgroup>
                    <Table.Thead>
                        <Table.Tr>
                            {editableObj && actions.length !== 0 && <Table.Th></Table.Th>}
                            {neededAttr.map(attr => (
                                <Table.Th key={attr} ta="left">
                                    <Group gap='xs'>
                                        <Text>{handleFormatHeader(attr)}</Text>
                                        {sortable && sortableFields?.includes(attr) && (
                                            <Button variant='subtle' onClick={() => handleSort(attr, direction)}>
                                                {orderBy === attr ? (direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                                            </Button>
                                        )}
                                        {searchable && searchableFields?.includes(attr) && (
                                            <TextInput
                                                placeholder={`Search ${handleFormatHeader(attr)}`}
                                                value={searchTerms[attr] || ''}
                                                onChange={(e) => handleSearchChange(attr, e.currentTarget.value)}
                                                size='xs'
                                            />
                                        )}
                                    </Group>
                                </Table.Th>
                            ))}
                            {editableObj && editFunction && <Table.Th>Edit</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={neededAttr.length + (editableObj ? 1 : 0)}>
                                    <Text size='xl'>No data available</Text>
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
                                                    checked={Array.from(selectedObjs).some(obj => obj.id === item.id)}
                                                    onChange={(event) => handleCheckboxChange(item, event.currentTarget.checked)}
                                                />
                                            </Table.Td>
                                        )}
                                        {neededAttr.map(attr => (
                                            <Table.Td key={attr}>
                                                {isEditing && editableFields?.includes(attr) ? (
                                                    <TextInput
                                                        value={editValues[attr]}
                                                        onChange={(e) => handleEditInputChange(attr, e.currentTarget.value)}
                                                    />
                                                ) : (
                                                    item[attr]
                                                )}
                                            </Table.Td>
                                        ))}
                                        {editableObj && editFunction && (
                                            <Table.Td>
                                                <Flex justify="left">
                                                    {isEditing ? (
                                                        <>
                                                            <Tooltip label="Submit Changes">
                                                                <ActionIcon
                                                                    size={'lg'}
                                                                    mr={8}
                                                                    color="green"
                                                                    onClick={() => handleEditSubmit(item)}
                                                                >
                                                                    <FaCheck />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Cancel Changes">
                                                                <ActionIcon
                                                                    size={'lg'}
                                                                    color="red"
                                                                    onClick={() => {
                                                                        setEditingRow(null);
                                                                        setEditValues({});
                                                                    }}
                                                                >
                                                                    <FaXmark />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <Tooltip label="Edit DNS Record">
                                                            <ActionIcon
                                                                onClick={() => handleEditClick(item)}
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
            <Group mt='md' ml='sm' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <Dialog opened={notification != null} size='xl'>
                        <Notification
                            title={notification?.[0]}
                            icon={notification?.[1] === 'Success' ? <FaRegCircleCheck /> : <FaRegCircleXmark />}
                            color='blue'
                            onClose={() => setNotification(null)}
                        />
                    </Dialog>
                )}
                {editableObj && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button disabled={selectedObjs.size === 0} onClick={() => setSelectedObjs(new Set())} color='#8d0d20'>
                            Clear Selection {selectedObjs.size !== 0 && `(${selectedObjs.size})`}
                        </Button>
                        <Button onClick={submitChange} color='blue'>
                            Submit
                        </Button>
                    </div>
                )}
            </Group>
        </Paper>
    );
};

export default PaginatedTable;
