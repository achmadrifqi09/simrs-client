"use client"

import {Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import React from "react";

const Education = () => {
    return (
        <>
            <Heading variant='section-title' headingLevel='h5'>
                Data Pendidikan
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
                        <TableHead>Pendidikan</TableHead>
                        <TableHead>Sekolah/Universitas</TableHead>
                        <TableHead>Program Studi</TableHead>
                        <TableHead>Kota Sekolah</TableHead>
                        <TableHead>Keahlian</TableHead>
                        <TableHead>No Ijazah</TableHead>
                        <TableHead>Tahun Lulus</TableHead>
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

export default Education
