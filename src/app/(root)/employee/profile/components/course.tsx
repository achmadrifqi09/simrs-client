"use client"

import {Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import React from "react";

const Course = () => {
    return (
        <>
            <Heading variant='section-title' headingLevel='h5'>
                Data Pelatihan
            </Heading>
            <div className="flex justify-end w-full mb-4">
                <Button>
                    Tambah Data
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Jenis Kegiatan</TableHead>
                        <TableHead>Tingkat</TableHead>
                        <TableHead>Kegiatan</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Sebagai</TableHead>
                        <TableHead>Tanggal Awal</TableHead>
                        <TableHead>Tanggal Akhir</TableHead>
                        <TableHead>File</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">Data tidak ditemukan</TableCell>
                    </TableRow>
                </TableHeader>
            </Table>
        </>
    )
}

export default Course
