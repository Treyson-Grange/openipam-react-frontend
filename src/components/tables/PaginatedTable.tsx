import { PaginatedData } from '../../types/api';
import { usePaginatedApi } from '../../hooks/useApi';
import { useState, useEffect } from 'react';
import { QueryRequest } from '../../utilities/apiFunctions';
import { Button, Paper, Title, Table, Text, Select, Group, Checkbox, Notification, Dialog, Pagination } from '@mantine/core';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { FaRegCircleXmark, FaRegCircleCheck } from 'react-icons/fa6';

interface BasePaginatedTableProps {
    /**
     * Function to get data from the API
     */
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    /**
     * Default page size
     */
    defPageSize: number;
    /**
     * Title of the table
     */
    title: string;
    /**
     * List of attributes to display
     */
    neededAttr: string[];
    /**
     * Additional page sizes to display in the page size dropdown
     */
    morePageSizes?: string[];
    /**
     * Whether the table has editable objects
     */
    sortable?: boolean;
}

interface EditablePaginatedTableProps extends BasePaginatedTableProps {
    /**
     * Whether the table has editable objects
     */
    editableObj: true;
    /**
     * List of actions to display in the action dropdown
     */
    actions: string[];
    /**
     * Object containing functions to call when submitting an action
     */
    actionFunctions: Record<string, (id: number) => void>;
}

interface NonEditablePaginatedTableProps extends BasePaginatedTableProps {
    /**
     * Default to false
     */
    editableObj?: false;
}

type PaginatedTableProps = EditablePaginatedTableProps | NonEditablePaginatedTableProps;

const PaginatedTable = (props: PaginatedTableProps): JSX.Element => {
    const actions = (props as EditablePaginatedTableProps).actions;
    const actionFunctions = (props as EditablePaginatedTableProps).actionFunctions;

    const { getFunction, defPageSize, title, neededAttr, morePageSizes, editableObj, sortable } = props;
    const [data, setData] = useState<any[]>([]);
    const [maxPages, setMaxPages] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defPageSize);
    const [page, setPage] = useState<number>(1);
    const [selectedObjs, setSelectedObjs] = useState<Set<number>>(new Set());
    const [notification, setNotification] = useState<string[] | null>(null);
    const [action, setAction] = useState<string>(actions[0]);
    const [orderBy, setOrderBy] = useState<string>('');
    const [direction, setDirection] = useState<string>('asc');

    const pageSizes = ['5', '10', '20'];
    if (morePageSizes) {
        const uniqueSizes = new Set([...pageSizes, ...morePageSizes]);
        pageSizes.length = 0;
        pageSizes.push(...Array.from(uniqueSizes).sort((a, b) => parseInt(a) - parseInt(b)));
    }

    const handlePageSizeChange = (value: string | null) => {
        setPage(1);
        setPageSize(parseInt(value || '5'));
    }

    const { data: paginatedData } = usePaginatedApi(
        getFunction,
        page,
        pageSize,
        orderBy ? { "order_by": orderBy, "direction": direction } : {}
    );

    const handleActionChange = (value: string | null) => {
        if (value) {
            setAction(value);
            console.log(`Action changed to ${value}`);
        }
    }

    const handleSort = (key: string, oldDirection: string) => {
        if (!sortable) return;
        let newDirection = 'asc';
        if (key === orderBy) {
            newDirection = oldDirection === 'asc' ? 'desc' : 'asc';
        }
        setDirection(newDirection);
        setOrderBy(key);
    }

    const ridSpaces = (str: string) => str.replace(/\s/g, '');

    const handleFormatHeader = (header: string) => header.replace(/[_-]/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());

    const handleCheckboxChange = (item: any, checked: boolean) => {
        setSelectedObjs(prevSelectedObjs => {
            const updatedSelectedObjs = new Set(prevSelectedObjs);
            if (checked) {
                updatedSelectedObjs.add(item.id);
            } else {
                updatedSelectedObjs.delete(item.id);
            }
            return updatedSelectedObjs;
        });
    };

    const submitChange = () => {
        const actionFunction = actionFunctions[ridSpaces(action)];
        try {
            if (actionFunction) {
                selectedObjs.forEach(id => actionFunction(id));
                setNotification(['Changes submitted successfully', 'Success']);
            }
            else {
                setNotification(['Error submitting changes: Invalid action', 'Error']);
            }
        }
        catch (error) {
            setNotification([`Error submitting changes: ${error}`, 'Error']);
            return;
        }
    }

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
                <Pagination total={maxPages} value={page} onChange={setPage} />
            </Group>
            <Table style={{ overflowX: 'auto' }}>
                <colgroup>
                    {editableObj && <col style={{ width: '5%' }} />}
                    {neededAttr.map(attr => (
                        <col key={attr} style={{ width: `${90 / neededAttr.length}%` }} />
                    ))}
                </colgroup>
                <Table.Thead>
                    <Table.Tr>
                        {editableObj && <Table.Th></Table.Th>}
                        {neededAttr.map(attr => (
                            <Table.Th key={attr} style={{ textAlign: 'left' }}>
                                <Group gap="xs">
                                    <Text>{handleFormatHeader(attr)}</Text>
                                    {sortable && (
                                        <Button variant="subtle" onClick={() => handleSort(attr, direction)}>
                                            {orderBy === attr ? (direction === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
                                        </Button>
                                    )}
                                </Group>
                            </Table.Th>
                        ))}
                        {neededAttr.some(attr => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[-+]\d{2}:\d{2}$/.test(attr)) && (
                            <Table.Th style={{ textAlign: 'right' }}>Date</Table.Th>
                        )}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((item: any) => {
                        return (
                            <Table.Tr key={item.id}>
                                {editableObj && (
                                    <Table.Td>
                                        <Checkbox
                                            checked={selectedObjs.has(item.id)}
                                            onChange={(event) => handleCheckboxChange(item, event.currentTarget.checked)}
                                        />
                                    </Table.Td>
                                )}
                                {neededAttr.map(attr => {
                                    const value = item[attr];
                                    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[-+]\d{2}:\d{2}$/;

                                    if (isoDateRegex.test(value)) {
                                        const date = new Date(value);
                                        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                                        return <Table.Td key={attr} style={{ textAlign: 'left' }}>{date.toLocaleDateString('en-US', options)}</Table.Td>;
                                    } else if (Array.isArray(value)) {
                                        return <Table.Td key={attr} style={{ textAlign: 'left' }}>{value.join(', ')}</Table.Td>;
                                    } else {
                                        return <Table.Td key={attr} style={{ textAlign: 'left' }}>{value || 'N/A'}</Table.Td>;
                                    }
                                })}

                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
            <Group mt='md' ml='sm' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        style={{ maxWidth: '80px', textAlign: 'center' }}
                        data={pageSizes}
                        value={pageSize.toString()}
                        onChange={handlePageSizeChange}
                    />
                    {editableObj && (
                        <Select
                            data={actions}
                            value={action}
                            onChange={handleActionChange}
                        />
                    )}
                </div>
                <Dialog opened={notification != null} size='xl'>
                    <Notification
                        title={notification?.[0]}
                        icon={notification?.[1] === 'Success' ? <FaRegCircleCheck /> : <FaRegCircleXmark />}
                        color='blue'
                        onClose={() => setNotification(null)}
                    />
                </Dialog>
                {editableObj && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button disabled={selectedObjs.size === 0} onClick={() => setSelectedObjs(new Set())} color='red'>
                            Clear Selection
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
