import React from 'react';
import { SegmentedControl } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';

/**
 * Control switch to toggle between seeing all hosts and only user hosts
 */
const HostControl: React.FC<{ currentSelection: string }> = ({
    currentSelection,
}) => {
    const navigate = useNavigate();
    const { config } = useConfig();
    return (
        <SegmentedControl
            data={[
                { value: 'userHosts', label: 'Your hosts' },
                {
                    value: 'allHosts',
                    label: `All ${config.organizationName} hosts`,
                },
            ]}
            value={currentSelection}
            onChange={(value) => {
                if (value === 'allHosts') {
                    navigate('/hosts/all');
                } else if (value === 'userHosts') {
                    navigate('/hosts');
                }
            }}
            color="blue"
            size="lg"
        />
    );
};

export default HostControl;
