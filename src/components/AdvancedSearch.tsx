import React, { useState, useEffect } from 'react';
import { MultiSelect, Group, ActionIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useApiData } from '../hooks/useApi';
import { FaX } from 'react-icons/fa6';
import { QueryRequest } from '../utilities/apiFunctions';
import { PaginatedData } from '../types/api';

export interface AutocompleteItem {
    value: string;
    label: string;
}

interface AdvancedSearchProps {
    onSelectionChange: (selectedItems: AutocompleteItem[]) => void;
    autocompleteFunc: QueryRequest<any, PaginatedData<unknown>>;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onSelectionChange,
    autocompleteFunc,
}) => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [selected, setSelected] = useState<AutocompleteItem[]>([]);

    const { data: autoCompleteData } = useApiData(autocompleteFunc, {
        q: debounce,
    });

    useEffect(() => {
        if (autoCompleteData && autoCompleteData.results) {
            const newData = autoCompleteData.results.map((item: any) => ({
                value: item.id,
                label: item.text,
            }));
            const updatedData = [
                ...selected,
                ...newData.filter(
                    (item) =>
                        !selected.some(
                            (selectedItem) => selectedItem.value === item.value,
                        ),
                ),
            ];

            setData(updatedData);
        }
    }, [autoCompleteData, selected]);

    const handleChange = (values: string[]) => {
        const selectedItems = values.map((value) =>
            data.find((item) => item.value === value),
        ) as AutocompleteItem[];
        setSelected(selectedItems);
        onSelectionChange(selectedItems);
    };

    return (
        <>
            <Group mt="lg" mr="xl" justify="flex-end">
                <MultiSelect
                    data={data}
                    value={selected.map((item) => item.value)}
                    onChange={handleChange}
                    searchable
                    searchValue={advancedSearch}
                    onSearchChange={setAdvancedSearch}
                    size="md"
                    aria-label="Advanced Search"
                    placeholder="Advanced Search"
                    nothingFoundMessage="No items found"
                    w={300}
                    styles={{
                        input: {
                            maxHeight: '5rem',
                            overflowY: 'auto',
                        },
                    }}
                />
                <ActionIcon
                    color="red"
                    size="lg"
                    disabled={selected.length === 0}
                    aria-label="Clear Selection"
                    onClick={() => {
                        setSelected([]);
                        onSelectionChange([]);
                    }}
                >
                    <FaX />
                </ActionIcon>
            </Group>
        </>
    );
};

export default AdvancedSearch;
