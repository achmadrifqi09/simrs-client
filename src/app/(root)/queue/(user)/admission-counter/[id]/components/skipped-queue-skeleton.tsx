import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Section from "@/components/ui/section";

const SkippedQueueSkeleton = () => {
    return (
        <Section className="2xl:col-span-3 h-max space-y-6">
            <Skeleton className="w-56 h-5 rounded mb-2"/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-sm">
                            <Skeleton className="h-4 w-16 rounded"/>
                        </TableHead>
                        <TableHead className="text-sm">
                            <Skeleton className="h-4 w-16 rounded"/>
                        </TableHead>
                        <TableHead className="text-sm">
                            <Skeleton className="h-4 w-16 rounded"/>
                        </TableHead>
                        <TableHead className="text-sm">
                            <Skeleton className="h-4 w-16 rounded"/>
                        </TableHead>
                        <TableHead className="text-sm">
                            <Skeleton className="h-4 w-16 rounded"/>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Array.from({length: 4}, (_, index: number) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-14 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-14 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-14 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-14 rounded"/>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-5 w-10 rounded"/>
                                            <Skeleton className="h-5 w-10 rounded"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </Section>
    )
}

export default SkippedQueueSkeleton;