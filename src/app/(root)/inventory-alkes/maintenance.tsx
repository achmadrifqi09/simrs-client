"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer,
    DrawerTrigger,
    DrawerContent,
} from "@/components/ui/drawer"; // import drawer components

const maintenance = () => {

    const handleMenuClick = () => {};

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
                                <Heading headingLevel="h5">Data Ruangan</Heading>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Ruangan</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>1</TableCell>
                                        <TableCell>Ruang Menyusui dan KIE</TableCell>
                                        <TableCell>1</TableCell>
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
                                        <TableCell>Ruang Persiapan Bersalin (Observasi) dengan komplikasi (pre-eclamsy labour)</TableCell>
                                        <TableCell>1</TableCell>
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
                    </Section>
                </div>
            </div>
        </>
    )
}
export default maintenance;
