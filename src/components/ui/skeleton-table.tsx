import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";

interface SkeletonTableProps {
    rowLength?: number;
    colLength?: number;
    isPagination?: boolean;
}

const SkeletonTable = ({rowLength = 4, colLength = 3, isPagination = false}: SkeletonTableProps) => {
    return (
        <div>
            <Skeleton className="h-10 w-24 md:w-32 mb-10"/>
            <Skeleton className="h-10 w-full md:w-1/3 my-6"/>
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            Array.from({length: rowLength}, (_, index: number) => {
                                return (
                                    <TableHead key={index} className="h-[48px]">
                                        <Skeleton className="h-4 w-16 md:w-24 rounded-[4px]"/>
                                    </TableHead>
                                )
                            })
                        }

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Array.from({length: colLength}, (_, idx: number) => {
                            return (
                                <TableRow key={idx}>
                                    {
                                        Array.from({length: rowLength}, (_, index: number) => {
                                            return (
                                                <TableCell key={index} className="h-[68px]">
                                                    <Skeleton className="h-4 w-16 md:w-24 rounded-[4px]"/>
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }

                </TableBody>
            </Table>
            {
                isPagination && (
                    <div className="flex justify-between items-center mt-2">
                        <Skeleton className="h-10 w-[128px] rounded-lg"/>
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default SkeletonTable