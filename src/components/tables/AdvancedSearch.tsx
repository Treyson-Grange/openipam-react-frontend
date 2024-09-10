import { Stack, Text } from '@mantine/core';
import AdvancedSearch from '../AdvancedSearch';
import { AutocompleteItem } from '../AdvancedSearch';
import { useState } from 'react';
import { getApiEndpointFunctions } from '../../utilities/apiFunctions';

const AdvancedSearchTable: React.FC = () => {
    const api = getApiEndpointFunctions();
    const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);
    const handleSelectionChange = (items: AutocompleteItem[]) => {
        setSelectedItems(items);
    };

    return (
        <>
            <AdvancedSearch
                onSelectionChange={handleSelectionChange}
                autocompleteFunc={api.autocomplete.generalAutocomplete}
            />
            <Stack>
                <Text>Selected Items</Text>

                {selectedItems
                    .map((item) => `${item.label} (${item.value})`)
                    .join(', ')}
            </Stack>
        </>
    );
};

export default AdvancedSearchTable;
