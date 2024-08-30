import { useState, useEffect } from 'react';
import { PaginatedData } from '../types/api';
import { useApiData } from '../hooks/useApi';
import { QueryRequest } from '../utilities/apiFunctions';
import {
    Button,
    Paper,
    Title,
    Table,
    Group,
    Loader,
    Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface DetailViewProps {
    getFunction: QueryRequest<any, PaginatedData<unknown>>;
    title: string;
    editable?: boolean;
    ModalComponent?: React.ComponentType<{ data: any; title: string }>;
}

const DetailView = (props: DetailViewProps): JSX.Element => {
    const { getFunction, title, editable, ModalComponent } = props;
    const [data, setData] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const { data: apiData, loading } = useApiData(getFunction);

    const form = useForm({});

    useEffect(() => {
        if (apiData) {
            setData([apiData]);
        }
    }, [apiData]);

    useEffect(() => {
        form.setValues({
            hostname: data[0]?.hostname,
            mac: data[0]?.mac,
            is_dynamic: data[0]?.is_dynamic == true ? 'true' : 'false',
            description: data[0]?.description,
        });
    }, [data]);

    return (
        <Paper radius="lg" p="lg" m="lg" withBorder>
            <Group justify="space-between">
                <Title>{title}</Title>
                {editable && (
                    <Button onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit'}
                    </Button>
                )}
            </Group>
            <Group>
                {loading ? (
                    <Loader />
                ) : editing ? (
                    ModalComponent ? (
                        <ModalComponent data={data} title={title} />
                    ) : (
                        <Text>No Modal Component</Text>
                    )
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Property</Table.Th>
                                <Table.Th>Value</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.map((item, index) =>
                                Object.keys(item).map((key) => (
                                    <Table.Tr key={`${index}-${key}`}>
                                        <Table.Td>{key}</Table.Td>
                                        <Table.Td>
                                            {typeof item[key] === 'object'
                                                ? JSON.stringify(item[key])
                                                : item[key]}
                                        </Table.Td>
                                    </Table.Tr>
                                )),
                            )}
                        </Table.Tbody>
                    </Table>
                )}
            </Group>
        </Paper>
    );
};
export default DetailView;
