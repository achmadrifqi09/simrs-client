"use client"

import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
} from "@/components/ui/drawer";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"; // import drawer components

const maintenance = () => {

    const handleMenuClick = () => {
    };

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                    <Heading headingLevel="h3" variant="page-title">
                        Pemeliharaan Alat Kesehatan
                    </Heading>
                </div>

                <div className="w-full gap-6">
                    <Section>
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <Heading headingLevel="h5">Data Pemeliharaan</Heading>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Alat</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>1</TableCell>
                                        <TableCell>Tensimeter</TableCell>
                                        <TableCell>Baik</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Drawer>
                                                    <DrawerTrigger asChild>
                                                        <Button variant='outline'>Detail</Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent>
                                                        <div>
                                                            <Heading headingLevel="h3" variant="page-title">
                                                                Detail
                                                            </Heading>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                                <Button variant='outline'>Hapus</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>2</TableCell>
                                        <TableCell>Defibrilator</TableCell>
                                        <TableCell>Baik</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant='outline'>Detail</Button>
                                                <Button variant='outline' onClick={handleMenuClick}>Hapus</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-6">
                            <Pagination className="mt-4 flex flex-col sm:flex-row gap-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#"/>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </Section>
                </div>
            </div>
        </>
    )
}
export default maintenance;
