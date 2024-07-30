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
    TextInput
} from '@mantine/core';
import {
    FaRegCircleXmark,
    FaRegCircleCheck,
    FaSort,
    FaSortUp,
    FaSortDown
} from 'react-icons/fa6';

interface BasePaginatedTableProps {
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    defPageSize: number;
    title: string;
    neededAttr: string[];
    morePageSizes?: string[];
    overridePageSizes?: boolean;
    sortable?: boolean;
    sortableFields?: string[];
    searchable?: boolean;
    searchableFields?: string[];
}

interface EditablePaginatedTableProps extends BasePaginatedTableProps {
    editableObj: true;
    actions?: string[];
    actionFunctions?: Record<string, { func: (params: any) => void, key: string }>;
}

interface NonEditablePaginatedTableProps extends BasePaginatedTableProps {
    editableObj?: false;
}

type PaginatedTableProps = EditablePaginatedTableProps | NonEditablePaginatedTableProps;

const PaginatedTable = (props: PaginatedTableProps): JSX.Element => {
    const actions = (props as EditablePaginatedTableProps).actions ?? [];
    const actionFunctions = (props as EditablePaginatedTableProps).actionFunctions ?? {};

    const { getFunction, defPageSize, title, neededAttr, morePageSizes, overridePageSizes, editableObj, sortable, sortableFields, searchable, searchableFields } = props;
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
    }

    const handleSearchChange = (field: string, value: string) => {
        setSearchTerms(prevTerms => ({ ...prevTerms, [field]: value }));
    }

    const { data: paginatedData } = usePaginatedApi(
        getFunction,
        page,
        pageSize,
        {
            ...orderBy ? { 'order_by': orderBy, 'direction': direction } : {},
            ...Object.fromEntries(Object.entries(searchTerms).filter(([_, v]) => v))
        }
    );

    const handleActionChange = (value: string | null) => {
        if (value) {
            setAction(value);
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
                updatedSelectedObjs.add(item);
            } else {
                updatedSelectedObjs.delete(item);
            }
            return updatedSelectedObjs;
        });
    };

    const submitChange = () => {
        const actionObj = actionFunctions[ridSpaces(action)];
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
                <Pagination total={maxPages} value={page} onChange={setPage} />
            </Group>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table>
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
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.map((item: any) => {
                            return (
                                <Table.Tr key={item.id}>
                                    {editableObj && (
                                        <Table.Td>
                                            <Checkbox
                                                checked={Array.from(selectedObjs).some(obj => obj.id === item.id)}
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
                                            return <Table.Td key={attr}>{date.toLocaleDateString('en-US', options)}</Table.Td>;
                                        } else if (Array.isArray(value)) {
                                            return <Table.Td key={attr}>{value.join(', ')}</Table.Td>;
                                        } else {
                                            return <Table.Td key={attr}>{value || 'N/A'}</Table.Td>;
                                        }
                                    })}
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </div>
            <Group mt='md' ml='sm' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        style={{ maxWidth: '80px', textAlign: 'center' }}
                        data={pageSizes}
                        value={pageSize.toString()}
                        onChange={handlePageSizeChange}
                    />
                    {editableObj && actions.length > 0 && (
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
