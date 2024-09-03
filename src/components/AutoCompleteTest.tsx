import React, { useState } from 'react';
import { TextInput, Text, Button } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect } from 'react';
import { useApiData } from '../hooks/useApi';
import { getApiEndpointFunctions } from '../utilities/apiFunctions';
const TextInputComponent: React.FC = () => {
    const [advancedSearch, setAdvancedSearch] = useState('');
    const [debounce] = useDebouncedValue(advancedSearch, 200);
    const api = getApiEndpointFunctions();
    const [data, setData] = useState<any[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdvancedSearch(event.target.value);
    };
    const { data: test } = useApiData(api.autocomplete.generalAutocomplete, {
        q: debounce,
    });
    useEffect(() => {
        if (test && test.results) {
            setData(test.results);
            console.log('Data:', test.results);
        }
    }, [test]);

    useEffect(() => {
        console.log('Debounced value:', debounce);
    }, [debounce]);

    return (
        <div>
            <Button
                onClick={() => {
                    console.log(data);
                }}
            ></Button>
            <TextInput
                type="text"
                value={advancedSearch}
                onChange={handleInputChange}
            />
            <Text>You entered: {advancedSearch}</Text>
            {test &&
                data.map((item: any) => <Text key={item.id}>{item.id}</Text>)}
        </div>
    );
};

export default TextInputComponent;
