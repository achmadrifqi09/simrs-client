// src/components/InventoryTable.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Section from "@/components/ui/section";
import { TableHeader, Table, TableRow, TableBody, TableCell, TableHead } from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const InventoryTable = ({ items, setItems }) => {

    const [nama, setNama] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [merkAlat, setMerkAlat] = useState('');
    const [kondisiAlat, setKondisiAlat] = useState('');
    const [ruangan, setRuangan] = useState('');
    const [tahunPengadaan, setTahunPengadaan] = useState('');
    const [jumlah, setJumlah] = useState(0);
    const [keterangan, setKeterangan] = useState('');
    const [ketersediaan, setKetersediaan] = useState('');

    const handleTambahAlat = () => {
        const newItem = {
            name: nama,
            serialNumber: serialNumber,
            brand: merkAlat,
            condition: kondisiAlat,
            room: ruangan,
            yearAcquisition: tahunPengadaan,
            quantity: jumlah,
            description: keterangan,
            availability: ketersediaan
        };
        setItems((prevItems) => [...prevItems, newItem]);
        // Reset form setelah penambahan
        setNama('');
        setSerialNumber('');
        setMerkAlat('');
        setKondisiAlat('');
        setRuangan('');
        setTahunPengadaan('');
        setJumlah(0);
        setKeterangan('');
        setKetersediaan('');
    };

    return (
        <Section>
            <div className="flex justify-between items-center mb-4">
                <Heading headingLevel="h5">Data Barang</Heading>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Tambah</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Tambah Alat Kesehatan</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nama Alat</Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="serialNumber" className="text-right">Serial Number</Label>
                                <Input
                                    id="serialNumber"
                                    className="col-span-3"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="merkAlat" className="text-right">Merk Alat</Label>
                                <Input
                                    id="merkAlat"
                                    className="col-span-3"
                                    value={merkAlat}
                                    onChange={(e) => setMerkAlat(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="kondisiAlat" className="text-right">Kondisi Alat</Label>
                                <Input
                                    id="kondisiAlat"
                                    className="col-span-3"
                                    value={kondisiAlat}
                                    onChange={(e) => setKondisiAlat(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ruangan" className="text-right">Ruangan</Label>
                                <Input
                                    id="ruangan"
                                    className="col-span-3"
                                    value={ruangan}
                                    onChange={(e) => setRuangan(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tahunPengadaan">Tahun Pengadaan</Label>
                                <Input
                                    id="tahunPengadaan"
                                    className="col-span-3"
                                    value={tahunPengadaan}
                                    onChange={(e) => setTahunPengadaan(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="Jumlah" className="text-right">Jumlah</Label>
                                <Input
                                    id="Jumlah"
                                    className="col-span-3"
                                    type="number"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(Number(e.target.value))}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="keterangan" className="text-right">Keterangan</Label>
                                <Input
                                    id="keterangan"
                                    className="col-span-3"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ketersediaan" className="text-right">Ketersediaan</Label>
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
                                <Button type="button" onClick={handleTambahAlat}>
                                    Save changes
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Merk</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                                <div className='flex gap-2'>
                                    <Button variant='outline'>Update</Button>
                                    <Button variant='outline'>Detail</Button>
                                    <Button variant='outline'>Permintaan Pembaruan</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Section>
    );
};

export default InventoryTable;
