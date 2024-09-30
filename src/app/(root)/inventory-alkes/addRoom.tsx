"use client";
import {Button} from "@/components/ui/button";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {Input} from "@/components/ui/input";

const InputRoom = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                <Heading headingLevel="h3" variant="page-title">
                    Ruangan
                </Heading>
            </div>

            <div className="flex gap-2">
                <Section className="flex-1">
                    <div className="w-full">
                        <Heading headingLevel="h5">Data Ruangan</Heading>
                        <div className="flex justify-between items-center mb-4">
                            {/* Input Search on the left, Add Button on the right */}
                            <div className="flex items-center">
                                <Input className="max-w-72" placeholder="Cari Ruangan..."/>
                            </div>
                            <div>
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button>Tambah</Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <div className="mx-auto w-[107rem]">
                                            <DrawerHeader>
                                                <DrawerTitle>Tambah Data Ruangan</DrawerTitle>
                                            </DrawerHeader>
                                            <div className="mt-4 w-full">
                                                <Table className="w-full table-auto">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-1/12">No</TableHead>
                                                            <TableHead className="w-4/12">Nama Ruangan</TableHead>
                                                            <TableHead className="w-2/12">Ketersediaan</TableHead>
                                                            <TableHead className="w-1/12">Jumlah</TableHead>
                                                            <TableHead className="w-2/12">Keterangan</TableHead>
                                                            <TableHead className="w-2/12">Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>1</TableCell>
                                                            <TableCell>Ruang Menyusui dan KIE</TableCell>
                                                            <TableCell>Ada</TableCell>
                                                            <TableCell>1</TableCell>
                                                            <TableCell>Baik</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button variant="outline">Edit</Button>
                                                                    <Button variant="outline">Hapus</Button>
                                                                    <Button variant="outline">Mutual</Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>2</TableCell>
                                                            <TableCell>
                                                                Ruang Persiapan Bersalin (Observasi) dengan komplikasi
                                                                (pre-eclamsy labour)
                                                            </TableCell>
                                                            <TableCell>Ada</TableCell>
                                                            <TableCell>1</TableCell>
                                                            <TableCell>Baik</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-2">
                                                                    <Button variant="outline">Edit</Button>
                                                                    <Button variant="outline">Hapus</Button>
                                                                    <Button variant="outline">Mutual</Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            {/* Pagination */}
                                            <div className="my-7">
                                                <Pagination>
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
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>

                        <div className="mt-4 w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Ruangan</TableHead>
                                        <TableHead>Ketersediaan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>1</TableCell>
                                        <TableCell>Ruang Menyusui dan KIE</TableCell>
                                        <TableCell>Ada</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>Baik</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline">Edit</Button>
                                                <Button variant="outline">Hapus</Button>
                                                <Button variant="outline">Mutual</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>2</TableCell>
                                        <TableCell>
                                            Ruang Persiapan Bersalin (Observasi) dengan komplikasi (pre-eclamsy labour)
                                        </TableCell>
                                        <TableCell>Ada</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>Baik</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline">Edit</Button>
                                                <Button variant="outline">Hapus</Button>
                                                <Button variant="outline">Mutual</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4">
                            <Pagination>
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
                    </div>
                </Section>
            </div>

        </div>
    );
};

export default InputRoom;
