import { PaginatedData } from '../../types/api';
import { usePaginatedApi } from '../../hooks/useApi';
import { useState, useEffect } from 'react';
import { QueryRequest } from '../../utilities/apiFunctions';
import { Button, Paper, Title, Table, Text, Select, Group, Checkbox, Notification, Dialog } from '@mantine/core';
import { FaArrowLeft, FaArrowRight, FaRegCircleXmark, FaRegCircleCheck } from 'react-icons/fa6';

interface BasePaginatedTableProps {
    /**
     * Function defined in the apiFunctions.ts file that will be used to fetch the data
     */
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    /**
     * Default number of items per page
     */
    defPageSize: number;
    /**
     * Title of the table
    */
    title: string;
    /**
     * List of attributes that will be displayed in the table
     */
    neededAttr: string[];
    /**
     * Additional page sizes that will be added to the default page sizes
    */
    morePageSizes?: string[];
}

/**
 * Allows for creation of a paginated table with the ability to select rows, and perform
 * actions on the selected rows.
 */
interface EditablePaginatedTableProps extends BasePaginatedTableProps {
    editableObj: true;
    /**
     * List of actions that can be performed on the selected rows
     */
    actions: string[];
    /**
     * Functions that will be called when an action is performed from the actions list
     */
    actionFunctions: Record<string, (id: number) => void>;
}

/**
 * Allows for creation of a paginated table that does not have the ability to select rows
 */
interface NonEditablePaginatedTableProps extends BasePaginatedTableProps {
    editableObj?: false;
}

type PaginatedTableProps = EditablePaginatedTableProps | NonEditablePaginatedTableProps;


const PaginatedTable = ({ getFunction, defPageSize, title, neededAttr, morePageSizes, editableObj }: PaginatedTableProps): JSX.Element => {
    const [data, setData] = useState<any[]>([]);
    const [maxPages, setMaxPages] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defPageSize);
    const [page, setPage] = useState<number>(1);
    const [selectedObjs, setSelectedObjs] = useState<Set<number>>(new Set());
    const [notification, setNotification] = useState<string[] | null>(null);

    const pageSizes = ['5', '10', '20'];
    if (morePageSizes) {
        const uniqueSizes = new Set([...pageSizes, ...morePageSizes]);
        pageSizes.length = 0;
        pageSizes.push(...Array.from(uniqueSizes).sort((a, b) => parseInt(a) - parseInt(b)));
    }

    const { data: paginatedData } = usePaginatedApi(getFunction, page, pageSize);

    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page > 1 ? page - 1 : 1);

    const handlePageSizeChange = (value: string | null) => setPageSize(parseInt(value || '5'));

    const handleFormatHeader = (header: string) => header.replace(/[_-]/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());

    const submitChange = () => {
        setNotification(['Changes submitted successfully', 'Success']);
        // setNotification(['Error while submitting', 'Failure']);
    }

    useEffect(() => {
        if (paginatedData && paginatedData.results) {
            setData(paginatedData.results);
            setMaxPages(Math.ceil(paginatedData.count / pageSize));
        }
    }, [paginatedData, pageSize]);

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

    return (
        <>
            <Paper radius='md' p='lg' m='lg' withBorder>
                <Title order={1}>{title}</Title>
                <Table style={{ overflowX: "auto" }}>
                    <Table.Thead>
                        <Table.Tr>
                            {editableObj && <Table.Th></Table.Th>}
                            {neededAttr.map(attr => (
                                <Table.Th key={attr} style={{ textAlign: 'left' }}>{handleFormatHeader(attr)}</Table.Th>
                            ))}
                            {neededAttr.some(attr => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[-+]\d{2}:\d{2}$/.test(attr)) && (
                                <Table.Th style={{ textAlign: 'right' }}>Date</Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data && data.map((item: any) => {
                            const dateAttrs: string[] = [];

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
                                            dateAttrs.push(date.toLocaleDateString('en-US', options));
                                            return <Table.Td key={attr} style={{ textAlign: 'left' }}>{date.toLocaleDateString('en-US', options)}</Table.Td>;
                                        } else if (Array.isArray(value)) {
                                            return <Table.Td key={attr} style={{ textAlign: 'left' }}>{value.join(', ')}</Table.Td>;
                                        } else {
                                            return <Table.Td key={attr} style={{ textAlign: 'left' }}>{value || 'N/A'}</Table.Td>;
                                        }
                                    })}
                                    {dateAttrs.length > 0 && (
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Text>{dateAttrs.join(' ')}</Text>
                                        </Table.Td>
                                    )}
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>

                <Group mt='md' ml='sm' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button onClick={prevPage} disabled={page <= 1} color='blue'>
                            <FaArrowLeft />
                        </Button>
                        <Button onClick={nextPage} disabled={page >= maxPages} color='blue'>
                            <FaArrowRight />
                        </Button>
                        <Select
                            style={{ maxWidth: '80px', textAlign: 'center' }}
                            data={pageSizes}
                            value={pageSize.toString()}
                            onChange={handlePageSizeChange}
                        />
                        {editableObj && (
                            <Button disabled={selectedObjs.size == 0} onClick={() => setSelectedObjs(new Set())} color='red'>
                                Clear Selection
                            </Button>

                        )}
                    </div>
                    <Dialog opened={notification != null} size="xl">
                        <Notification
                            title={notification?.[0]}
                            icon={notification?.[1] === 'Success' ? <FaRegCircleCheck /> : <FaRegCircleXmark />}
                            color='blue'
                            onClose={() => setNotification(null)}
                        />
                    </Dialog>
                    {editableObj && (
                        <Button onClick={submitChange} color='blue'>
                            Submit
                        </Button>
                    )}
                </Group>
            </Paper >
        </>
    );
};

export default PaginatedTable;
