import React, { useState, useEffect } from 'react';
import { Button, MultiSelect } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useApiData } from '../hooks/useApi';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

interface SelectItem {
    value: string;
    label: string;
}

const AutoCompleteTest: React.FC = () => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const api = getApiEndpointFunctions();
    const [data, setData] = useState<SelectItem[]>([]);
    const [selected, setSelected] = useState<SelectItem[]>([]);

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
        ) as SelectItem[];
        setSelected(selectedItems);
    };

    return (
        <>
            <MultiSelect
                data={data}
                value={selected.map((item) => item.value)}
                onChange={handleChange}
                searchable
                searchValue={advancedSearch}
                onSearchChange={setAdvancedSearch}
                size="md"
                placeholder="Advanced Search"
                clearable
            />
            <Button onClick={() => console.log(selected)}>Log Selected</Button>
        </>
    );
};

export default AutoCompleteTest;
