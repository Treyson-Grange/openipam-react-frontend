import React, { useState, useEffect } from 'react';
import { MultiSelect, Group, ActionIcon, Paper, Chip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useApiData } from '../hooks/useApi';
import { FaX } from 'react-icons/fa6';
import { QueryRequest } from '../utilities/apiFunctions';
import { PaginatedData } from '../types/api';
import { getCookie, setCookie, deleteCookie } from '../utilities/cookie';

export interface AutocompleteItem {
    /**
     * Value of the item for search
     */
    value: string;
    /**
     * Label of the item to display
     */
    label: string;
}

interface AdvancedSearchProps {
    /**
     * Callback to handle selection change.
     * @param selectedItems
     * @returns
     */
    onSelectionChange: (selectedItems: AutocompleteItem[]) => void;
    /**
     * Function to call for autocomplete data. (usually api.autocomplete.generalAutocomplete)
     */
    autocompleteFunc: QueryRequest<any, PaginatedData<unknown>>;
}

const COOKIE_NAME = 'advanced_search_selected';

/**
 * Advanced Search component allows for searching and selecting multiple items.
 * Depending on endpoint, can search based on user, group, permissions, contentType, or all of the above.
 * Works the same as in live openIPAM. Is included as an option in the PaginatedTable.
 */
const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    onSelectionChange,
    autocompleteFunc,
}) => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [selected, setSelected] = useState<AutocompleteItem[]>(() => {
        const cookieValue = getCookie(COOKIE_NAME);
        if (cookieValue) {
            try {
                return JSON.parse(cookieValue) as AutocompleteItem[];
            } catch {
                return [];
            }
        }
        return [];
    });

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

    useEffect(() => {
        setCookie(COOKIE_NAME, JSON.stringify(selected), 7);
    }, [selected]);

    const handleChange = (values: string[]) => {
        const selectedItems = values.map((value) =>
            data.find((item) => item.value === value),
        ) as AutocompleteItem[];
        setSelected(selectedItems);
        onSelectionChange(selectedItems);
    };

    const handleRemove = (value: string) => {
        const updatedSelected = selected.filter((item) => item.value !== value);
        setSelected(updatedSelected);
        onSelectionChange(updatedSelected);
    };

    return (
        <>
            <Group mt="lg" mr="xl" justify="flex-end" align="flex-start">
                {selected && selected.length > 0 && (
                    <Paper withBorder p="sm" radius="xl">
                        <Group justify="space-between">
                            {selected.map((item) => (
                                <Chip
                                    key={item.value}
                                    onClick={() => handleRemove(item.value)}
                                >
                                    <Group>
                                        {item.label}
                                        <FaX />
                                    </Group>
                                </Chip>
                            ))}
                        </Group>
                    </Paper>
                )}

                <Group justify="flex-end">
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
                        styles={() => ({
                            pill: {
                                display: 'none',
                            },
                        })}
                    />
                    <ActionIcon
                        color="red"
                        size="lg"
                        disabled={selected.length === 0}
                        aria-label="Clear Selection"
                        onClick={() => {
                            setSelected([]);
                            onSelectionChange([]);
                            deleteCookie(COOKIE_NAME);
                        }}
                    >
                        <FaX />
                    </ActionIcon>
                </Group>
            </Group>
        </>
    );
};

export default AdvancedSearch;
