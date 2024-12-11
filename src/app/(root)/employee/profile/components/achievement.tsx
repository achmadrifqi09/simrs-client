"use client"

import {Table, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import React from "react";

const Achievement = () => {
    return (
        <>
            <div className="flex flex-col w-full">
                <div>
                    <Heading variant='section-title' headingLevel='h5'>
                        Prestasi
                    </Heading>
                    <div className="flex justify-end w-full mb-4">
                        <Button>
                            Tambah Data
                        </Button>
                    </div>
                </div>
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>No. SK</TableHead>
                                <TableHead>Prestasi</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>File</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Data tidak ditemukan</TableCell>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
                <div className="flex flex-col w-full mt-4">
                    <Heading variant='section-title' headingLevel='h5'>
                        Sanksi
                    </Heading>
                    <div className="flex justify-end w-full mb-4">
                        <Button>
                            Tambah Data
                        </Button>
                    </div>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>No. SK</TableHead>
                                    <TableHead>Sanksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>File</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Data tidak ditemukan</TableCell>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Achievement
