import {Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow
} from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import React from "react";

const NonClinicalTable = () => {
    return (
        <div className="overflow-x-auto mt-4">
            <div className="flex w-full">
                <Heading headingLevel="h5">Data Barang</Heading>
            </div>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Department</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>HR</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>Finance</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>IT</TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default NonClinicalTable;