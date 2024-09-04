import { Stack, Text } from '@mantine/core';
import AdvancedSearch from '../AdvancedSearch';
import { AutocompleteItem } from '../AdvancedSearch';
import { useState } from 'react';

const AdvancedSearchTable: React.FC = () => {
    const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);
    const handleSelectionChange = (items: AutocompleteItem[]) => {
        setSelectedItems(items);
    };

    return (
        <>
            <AdvancedSearch onSelectionChange={handleSelectionChange} />
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
