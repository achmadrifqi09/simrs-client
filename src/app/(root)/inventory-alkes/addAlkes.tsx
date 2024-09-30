"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import {  Upload } from "lucide-react";
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
    PaginationPrevious
} from "@/components/ui/pagination";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AlatKesehatan = {
    id: number;
    nama: string;
    ketersediaan: string;
    jumlah: number;
    keterangan: string;
};

const initialState: AlatKesehatan[] = [
    { id: 1, nama: "Tensimeter", ketersediaan: "Ada", jumlah: 1, keterangan: "Baik" },
    { id: 2, nama: "Defibrilator", ketersediaan: "Ada", jumlah: 1, keterangan: "Baik" },
];
const InputAlkes = () => {
    const [alatKesehatan, setAlatKesehatan] = useState<AlatKesehatan[]>(initialState);
    const [nama, setNama] = useState("");
    const [ketersediaan, setKetersediaan] = useState("");
    const [jumlah, setJumlah] = useState(1);
    const [serialNumber, setSerialNumber] = useState("");
    const [merkAlat, setMerkAlat] = useState("");
    const [kondisiAlat, setKondisiAlat] = useState("");
    const [ruangan, setRuangan] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [selectedAlat, setSelectedAlat] = useState<AlatKesehatan | null>(null);

    const handleViewAlat = (alat: AlatKesehatan) => {
        setSelectedAlat(alat);
    };


    const handleDelete = (id: number) => {
        const updatedAlatKesehatan = alatKesehatan.filter(alat => alat.id !== id);
        setAlatKesehatan(updatedAlatKesehatan);

        // Reset selectedAlat if the deleted item was selected
        if (selectedAlat && selectedAlat.id === id) {
            setSelectedAlat(null);
        }
    };

    const handleTambahAlat = () => {
        const newAlat = {
            id: alatKesehatan.length + 1,
            nama,
            ketersediaan,
            jumlah,
            keterangan,
        };
        setAlatKesehatan([...alatKesehatan, newAlat]);

        setNama("");
        setKetersediaan("");
        setJumlah(1);
        setKeterangan("");
    };

    return (
        <div>
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                <Heading headingLevel="h3" variant="page-title">
                    Alat Kesehatan
                </Heading>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Section className="flex-1">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <Heading headingLevel="h5">Data Alat Kesehatan</Heading>
                            <div className="flex flex-wrap space-x-4 items-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Upload className="mr-2" />
                                            Import
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Upload File</DialogTitle>
                                            <DialogDescription>Format File csv, xlsx</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="file">
                                                Input File
                                            </Label>
                                            <Input
                                                id="file"
                                                type="file"
                                                className="col-span-3"
                                                accept=".csv,.xlsx"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Unggah</Button>
                                            <Button variant='outline'>Batal</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button>Tambah Alat</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle>Tambah Alat Kesehatan</SheetTitle>
                                        </SheetHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Nama Alat
                                                </Label>
                                                <Input
                                                    id="name"
                                                    className="col-span-3"
                                                    value={nama}
                                                    onChange={(e) => setNama(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="serialNumber" className="text-right">
                                                    Serial Number
                                                </Label>
                                                <Input
                                                    id="serialNumber"
                                                    className="col-span-3"
                                                    value={serialNumber}
                                                    onChange={(e) => setSerialNumber(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="merkAlat" className="text-right">
                                                    Merk Alat
                                                </Label>
                                                <Input
                                                    id="merkAlat"
                                                    className="col-span-3"
                                                    value={merkAlat}
                                                    onChange={(e) => setMerkAlat(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="kondisiAlat" className="text-right">
                                                    Kondisi Alat
                                                </Label>
                                                <Input
                                                    id="kondisiAlat"
                                                    className="col-span-3"
                                                    value={kondisiAlat}
                                                    onChange={(e) => setKondisiAlat(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="ruangan" className="text-right">
                                                    Ruangan
                                                </Label>
                                                <Input
                                                    id="ruangan"
                                                    className="col-span-3"
                                                    value={ruangan}
                                                    onChange={(e) => setRuangan(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="tahunPengadaan">
                                                    Tahun Pengadaan
                                                </Label>
                                                {/* <Popover>*/}
                                                {/*    <PopoverTrigger asChild>*/}
                                                {/*        <Button*/}
                                                {/*            variant={"outline"}*/}
                                                {/*            className={cn(*/}
                                                {/*                "w-[240px] justify-start text-left font-normal border-input",*/}
                                                {/*                !date && "text-muted-foreground"*/}
                                                {/*            )}*/}
                                                {/*        >*/}
                                                {/*            <CalendarDays className="mr-2 h-4 w-4" />*/}
                                                {/*            {date ? format(date,'PPP') : <span>Pick a date</span>}*/}
                                                {/*        </Button>*/}
                                                {/*    </PopoverTrigger>*/}
                                                {/*    <PopoverContent className="w-auto p-0" align="start">*/}
                                                {/*        <Calendar*/}
                                                {/*            mode="single"*/}
                                                {/*            selected={date}*/}
                                                {/*            onSelect={setDate}*/}
                                                {/*            initialFocus*/}
                                                {/*        />*/}
                                                {/*    </PopoverContent>*/}
                                                {/*</Popover>*/}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="Jumlah" className="text-right">
                                                    Jumlah
                                                </Label>
                                                <Input
                                                    id="Jumlah"
                                                    className="col-span-3"
                                                    type="number"
                                                    value={jumlah}
                                                    onChange={(e) => setJumlah(Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="keterangan" className="text-right">
                                                    Keterangan
                                                </Label>
                                                <Input
                                                    id="keterangan"
                                                    className="col-span-3"
                                                    value={keterangan}
                                                    onChange={(e) => setKeterangan(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="ketersediaan" className="text-right">
                                                    Ketersediaan
                                                </Label>
                                                <Input
                                                    id="ketersediaan"
                                                    className="col-span-3"
                                                    value={ketersediaan}
                                                    onChange={(e) => setKetersediaan(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <SheetFooter>
                                            <SheetClose asChild>
                                                <Button type="submit" onClick={handleTambahAlat}>
                                                    Save changes
                                                </Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                        <div className="my-4">
                            <div className="my-3 flex justify-between items-center">
                                <Input className="max-w-72" placeholder="Cari Alat..."/>
                            </div>
                        </div>
                        <div className="mt-4 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Alat</TableHead>
                                        <TableHead>Ketersediaan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alatKesehatan.map((alat, index) => (
                                        <TableRow key={alat.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{alat.nama}</TableCell>
                                            <TableCell>{alat.ketersediaan}</TableCell>
                                            <TableCell>{alat.jumlah}</TableCell>
                                            <TableCell>{alat.keterangan}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Drawer onClose={() => setSelectedAlat(null)}>
                                                        <DrawerTrigger asChild>
                                                            <Button variant="outline" onClick={() => handleViewAlat(alat)}>View</Button>
                                                        </DrawerTrigger>
                                                        <DrawerContent className="w-full">
                                                            <DrawerHeader>
                                                                <DrawerTitle>Detail Alat Kesehatan</DrawerTitle>
                                                            </DrawerHeader>
                                                            {selectedAlat ? (
                                                                <div className="mt-4 w-full">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>No</TableHead>
                                                                                <TableHead>Nama Alat</TableHead>
                                                                                <TableHead>Ketersediaan</TableHead>
                                                                                <TableHead>Jumlah</TableHead>
                                                                                <TableHead>Keterangan</TableHead>
                                                                                <TableHead>Aksi</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell>1</TableCell>
                                                                                <TableCell>{selectedAlat.nama}</TableCell>
                                                                                <TableCell>{selectedAlat.ketersediaan}</TableCell>
                                                                                <TableCell>{selectedAlat.jumlah}</TableCell>
                                                                                <TableCell>{selectedAlat.keterangan}</TableCell>
                                                                                <TableCell>
                                                                                    <div className="flex gap-4">
                                                                                        <Button variant='outline'>Edit</Button>
                                                                                        <Button variant='outline'>Pindah</Button>
                                                                                        <Button variant='outline' onClick={() => handleDelete(selectedAlat.id)}>Delete</Button>
                                                                                    </div>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                    <div className="flex justify-end gap-4 mb-4">
                                                                        <Button>Tambah</Button>
                                                                        <Button variant="outline" onClick={() => handleDelete(selectedAlat.id)}>Hapus</Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>Tidak ada alat yang dipilih</div>
                                                            )}
                                                        </DrawerContent>
                                                    </Drawer>
                                                    <Button variant='outline' onClick={() => handleDelete(alat.id)}>Delete</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-6">
                            <Pagination className="mt-4 flex flex-col sm:flex-row gap-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
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
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
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

export default InputAlkes;
