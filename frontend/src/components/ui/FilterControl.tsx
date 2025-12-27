import React from 'react';
import { Filter, CheckCircle2 } from 'lucide-react';
import { Button, Dropdown, type DropdownItem } from '../ui';
import type { FilterControlProps } from '../../types';

const FilterControl: React.FC<FilterControlProps> = ({
    value,
    onChange,
    options,
    label = 'Filters',
    className = '',
    variant, // Use this if passed, otherwise derive from value
}) => {
    // If variant is not explicitly passed, determine based on whether a filter is active
    const buttonVariant = variant || (value ? 'primary' : 'secondary');

    const getLabel = () => {
        if (!value) return label;
        // Find the option that matches the current value
        const selected = options.find(opt => opt.value === value);
        // If found, use its label (maybe truncated or stylized if needed, but for now simple)
        if (selected) {
            // Special case for Priorities or other enums to look nice? 
            // Or just use the label safely.
            return selected.label;
        }
        return label;
    };

    const dropdownItems: DropdownItem[] = options.map(option => ({
        key: option.key,
        label: option.label,
        onClick: () => onChange(option.value),
        // Optional: Add checkmark if selected
        icon: value === option.value ? <CheckCircle2 size={14} className="text-blue-500" /> : undefined
    }));

    return (
        <Dropdown
            trigger={
                <Button
                    variant={buttonVariant}
                    className={`h-9 px-3 text-sm font-medium transition-all shadow-sm ${buttonVariant === 'secondary'
                        ? 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        : ''
                        } ${className}`}
                    leftIcon={<Filter size={16} className={value ? "text-white" : "text-gray-500"} />}
                >
                    {getLabel()}
                </Button>
            }
            items={dropdownItems}
        />
    );
};

export default FilterControl;
