"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import useGet from "@/hooks/use-get";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "debounce";

interface SearchSelectProps<T> {
    url: string;
    placeholder?: string;
    onSelect: (selected: T | null) => void;
    displayField: keyof T;
    valueField: keyof T;
}

type ApiResponse<T> = {
    results?: T[];
    pagination?: {
        current_cursor: number;
        take: number;
    };
} | T[];

function SearchSelect<T extends Record<string, any>>({
                                                         url,
                                                         placeholder,
                                                         onSelect,
                                                         displayField,
                                                         valueField
                                                     }: SearchSelectProps<T>) {
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { data, loading, getData } = useGet<ApiResponse<T>>({
        url: url,
        keyword: search,
    });

    const debouncedGetDataRef = useRef<ReturnType<typeof debounce>>();

    useEffect(() => {
        debouncedGetDataRef.current = debounce((searchTerm: string) => {
            if (searchTerm) {
                getData();
            }
        }, 600);

        return () => {
            if (debouncedGetDataRef.current) {
                debouncedGetDataRef.current.clear();
            }
        };
    }, [getData]);

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearch(keyword);
        setIsOpen(true);
        if (selectedItem) {
            setSelectedItem(null);
            onSelect(null);
        }
        debouncedGetDataRef.current?.(keyword);
    };

    const handleSelectItem = (item: T) => {
        setSelectedItem(item);
        setSearch(item[displayField] as string);
        setIsOpen(false);
        onSelect(item);
    };

    const getItems = (apiResponse: ApiResponse<T> | null): T[] => {
        if (!apiResponse) return [];
        if (Array.isArray(apiResponse)) return apiResponse;
        if ('results' in apiResponse && Array.isArray(apiResponse.results)) return apiResponse.results;
        return [];
    };

    const items = getItems(data);

    return (
        <div className="relative">
            <Input
                type="text"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={placeholder}
                value={search}
                onChange={handleChangeSearch}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {isOpen && search && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 max-h-60 overflow-auto rounded-md shadow-md">
                    {loading && (
                        <li className="p-2 text-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading ...
                        </li>
                    )}
                    {!loading && items.length === 0 && (
                        <li className="p-2 text-center text-gray-500">
                            Data tidak ditemukan
                        </li>
                    )}
                    {items.map((item) => (
                        <li
                            key={item[valueField] as string}
                            className={cn(
                                "p-2 hover:bg-gray-100 cursor-pointer text-sm",
                                selectedItem === item && "bg-gray-100"
                            )}
                            onClick={() => handleSelectItem(item)}
                        >
                            {item[displayField] as string}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchSelect;