import React, { useState, useEffect } from 'react';
import { MultiSelect, Group, ActionIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useApiData } from '../hooks/useApi';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
import { FaX } from 'react-icons/fa6';

export interface AutocompleteItem {
    value: string;
    label: string;
}

interface AdvancedSearchProps {
    onSelectionChange: (selectedItems: AutocompleteItem[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onSelectionChange,
}) => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const api = getApiEndpointFunctions();
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [selected, setSelected] = useState<AutocompleteItem[]>([]);

    const { data: autoCompleteData } = useApiData(
        api.autocomplete.generalAutocomplete,
        {
            q: debounce,
        },
    );

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
                    placeholder="Advanced Search"
                    nothingFoundMessage="No items found"
                    w={400}
                />
                <ActionIcon
                    color="red"
                    size="lg"
                    disabled={selected.length === 0}
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
