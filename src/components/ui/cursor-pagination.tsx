import React from 'react';
import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationProps {
    currentCursor: number;
    take: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onItemsPerPageChange: (value: number) => void;
    itemsPerPageOptions?: number[];
    hasMore: boolean;
}

const CursorPagination: React.FC<PaginationProps> = ({
                                                   currentCursor,
                                                   take,
                                                   onNextPage,
                                                   onPreviousPage,
                                                   onItemsPerPageChange,
                                                   itemsPerPageOptions = [10, 20, 30, 40, 50],
                                                   hasMore
                                               }) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Select
                value={take.toString()}
                onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
                <SelectTrigger className="w-[128px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {itemsPerPageOptions.map((option) => (
                            <SelectItem key={option} value={option.toString()}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="flex gap-2 items-center">
                <Button variant="outline" size="icon" disabled={currentCursor === 0} onClick={onPreviousPage}>
                    <LuChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNextPage}
                    disabled={!hasMore}
                >
                    <LuChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default CursorPagination;