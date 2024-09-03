import React, { useState } from 'react';
import { MultiSelect } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect } from 'react';
import { useApiData } from '../hooks/useApi';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';

const TextInputComponent: React.FC = () => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const api = getApiEndpointFunctions();
    const [data, setData] = useState<any[]>([]);
    const [dataTexts, setDataTexts] = useState<any[]>([]);
    const [dataIds, setDataIds] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);

    const { data: test } = useApiData(api.autocomplete.generalAutocomplete, {
        q: debounce,
    });
    useEffect(() => {
        if (test && test.results) {
            setData(test.results);
            setDataTexts(test.results.map((item: any) => item.text));
            setDataIds(test.results.map((item: any) => item.id));
        }
    }, [test]);

    useEffect(() => {
        console.log('Debounced value:', debounce);
    }, [debounce]);

    return (
        <MultiSelect
            data={dataTexts}
            value={selected}
            onChange={setSelected}
            label="Advanced Search"
            searchable
            searchValue={advancedSearch}
            onSearchChange={setAdvancedSearch}
            size="md"
        />
    );
};

export default TextInputComponent;
