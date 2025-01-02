import Select, { MultiValue, SingleValue } from 'react-select';
import { components, DropdownIndicatorProps } from 'react-select';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface SelectSearchProps<T> {
    options: T[] | null;
    labelName: keyof T;
    valueName: keyof T;
    defaultValue?: string | number;
    placeholder?: string;
    onChange: (value: string | number | null) => void;
}

const DropdownIndicator = (props: DropdownIndicatorProps<Option>) => {
    return (
        <components.DropdownIndicator {...props}>
            <ChevronsUpDown className="text-gray-400 w-5 h-5" />
        </components.DropdownIndicator>
    );
};

const SelectSearchClient = <T extends Record<string, any>>({
    options,
    valueName,
    labelName,
    onChange,
    placeholder,
}: SelectSearchProps<T>) => {
    const [selectedOption, setSelectedOption] = useState<SingleValue<Option> | MultiValue<Option>>(null);

    const buildOptions = () => {
        if (Array.isArray(options)) {
            return options.map((value: any) => {
                return { label: value[labelName], value: value[valueName] };
            });
        }
        return [];
    };

    const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
        setSelectedOption(newValue);
        const val: Option = Array.isArray(newValue) ? newValue[0] : { ...newValue };
        onChange(val?.value || '');
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: 'rgb(229 231 235)',
            boxShadow: 'none',
            fontSize: '14px',
            paddingTop: '1px',
            paddingBottom: '1px',
            '&:hover': {
                borderColor: 'rgb(229 231 235)',
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'rgb(17 24 39)',
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: '6px',
            zIndex: 9999,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'rgb(220 38 38)' : state.isFocused ? 'white' : 'white',
            color: state.isSelected ? 'white' : 'black',
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: state.isSelected ? 'rgb(220 38 38)' : 'rgb(243 244 246)',
                color: state.isSelected ? 'white' : 'black',
            },
        }),
    };

    return (
        <Select
            onChange={handleChange}
            placeholder={placeholder}
            components={{ DropdownIndicator }}
            styles={customStyles}
            defaultValue={selectedOption}
            options={buildOptions()}
        />
    );
};

export default SelectSearchClient;
