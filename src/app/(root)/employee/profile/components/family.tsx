"use client"

import {Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import React from "react";

const Family = () => {
    return (
        <>
            <Heading variant='section-title' headingLevel='h5'>
                Data Keluarga
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
                        <TableHead>Nama</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>NIK</TableHead>
                        <TableHead>Tempat Lahir</TableHead>
                        <TableHead>Tanggal Lahir</TableHead>
                        <TableHead>File</TableHead>
                    </TableRow>
            <TableRow>
                <TableCell colSpan={7} className="text-center">Data tidak ditemukan</TableCell>
            </TableRow>
                </TableHeader>
            </Table>
        </>
    )
}

export default Family
