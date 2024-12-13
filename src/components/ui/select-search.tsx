import React, { useCallback, useEffect, useState } from 'react';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import axios, { AxiosResponse } from 'axios';
import { useSession } from 'next-auth/react';
import { generateSignature } from '@/lib/crypto-js/cipher';
import { components, DropdownIndicatorProps, GroupBase } from 'react-select';
import debounce from 'debounce';
import { toast } from '@/hooks/use-toast';
import { ChevronsUpDown } from 'lucide-react';

interface SelectSearchProps<T> {
    url: string;
    labelName: keyof T;
    valueName: keyof T;
    defaultValue?: string | number;
    placeholder?: string;
    onChange?: (value: string | number | null) => void;
    clearTrigger?: number;
}

type Option = {
    label: string;
    value: string | number;
};

const DropdownIndicator = (props: DropdownIndicatorProps<Option>) => {
    return (
        <components.DropdownIndicator {...props}>
            <ChevronsUpDown className="text-gray-400 w-5 h-5" />
        </components.DropdownIndicator>
    );
};

const SelectSearch = <T extends Record<string, any>>({
    url,
    labelName,
    valueName,
    defaultValue,
    placeholder = 'Pilih opsi ...',
    onChange,
    clearTrigger,
}: SelectSearchProps<T>) => {
    const { data: session } = useSession();
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const generateOptions = (options: T[] | { results?: T[] }): Option[] => {
        if (Array.isArray(options)) {
            return options.map((item: T) => ({
                value: item[valueName] as string | number,
                label: item[labelName] as string,
            }));
        } else if (options && 'results' in options && Array.isArray(options.results)) {
            return options.results.map((item: T) => ({
                value: item[valueName] as string | number,
                label: item[labelName] as string,
            }));
        }
        return [];
    };

    const fetchOptions = async (inputValue: string): Promise<Option[]> => {
        try {
            const currentHeader: Record<string, string | undefined> = {
                'client-signature': generateSignature() ?? '',
                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : undefined,
            };

            const response: AxiosResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}${
                    url.includes('?') ? inputValue && '&keyword=' + inputValue : inputValue && '?keyword=' + inputValue
                }`,
                {
                    headers: currentHeader,
                    params: { search: inputValue },
                }
            );

            if (response.status === 200) {
                const data = response.data?.data;
                return generateOptions(Array.isArray(data) ? data : data?.results || []);
            }
            return [];
        } catch {
            toast({
                description: 'Gagal mendapatkan data opsi data',
            });
            return [];
        }
    };

    const debouncedFetchOptions = useCallback(
        debounce((inputValue: string, callback: (options: Option[]) => void) => {
            fetchOptions(inputValue).then(callback);
        }, 500),
        []
    );

    const loadOptions: AsyncProps<Option, false, GroupBase<Option>>['loadOptions'] = (inputValue, callback) => {
        debouncedFetchOptions(inputValue, callback);
    };

    const handleChange = (newValue: Option | null) => {
        setSelectedOption(newValue);
        if (onChange) {
            onChange(newValue ? newValue.value : null);
        }
    };

    useEffect(() => {
        const loadDefaultValue = async () => {
            if (defaultValue !== undefined) {
                const options = await fetchOptions(defaultValue as string);
                const defaultOption = options.find((option) => option.value === defaultValue);
                if (defaultOption) {
                    setSelectedOption(defaultOption);
                    if (onChange) {
                        onChange(defaultOption.value);
                    }
                }
            }
        };
        loadDefaultValue().catch(() => {
            toast({
                description: 'Gagal mendapatkan data opsi data',
            });
        });
    }, [defaultValue]);

    useEffect(() => {
        if (clearTrigger !== 0) {
            setSelectedOption(null);
        }
    }, [clearTrigger, url]);

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: 'transparent',
            boxShadow: 'none',
            paddingTop: '1px',
            paddingBottom: '1px',
            '&:hover': {
                borderColor: 'transparent',
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
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: state.isSelected ? 'rgb(220 38 38)' : 'rgb(243 244 246)',
                color: state.isSelected ? 'white' : 'black',
            },
        }),
    };

    return (
        <AsyncSelect<Option, false, GroupBase<Option>>
            loadOptions={loadOptions}
            defaultOptions
            value={selectedOption}
            onChange={handleChange}
            placeholder={placeholder}
            styles={customStyles}
            className="border border-input rounded-md text-sm"
            classNamePrefix="react-select"
            components={{ DropdownIndicator }}
        />
    );
};

export default SelectSearch;
