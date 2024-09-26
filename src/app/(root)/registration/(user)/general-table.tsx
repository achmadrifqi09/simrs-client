import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {PatientType} from "@/types/patient";

type GeneralTableProps = {
    generalPatient: PatientType[];
};

const GeneralTable = ({generalPatient}: GeneralTableProps) => {
    return (
        <>
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="w-[120px] text-center">Kode RM</TableHead>
                        <TableHead className="w-[150px] text-center">No Antrean</TableHead>
                        <TableHead className="w-[180px] text-center">
                            Kode Booking
                        </TableHead>
                        <TableHead className="w-[250px] text-center">Nama Pasien</TableHead>
                        <TableHead className="w-[150px] text-center">Poliklinik</TableHead>
                        <TableHead className="w-[200px] text-center">Dokter</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-gray-500">
                    {generalPatient.map((item) => (
                        <TableRow key={item.no}>
                            <TableCell className="w-[50px]">{item.no}</TableCell>
                            <TableCell className="w-[120px] text-center">
                                {item.kode_rm}
                            </TableCell>
                            <TableCell className="w-[150px] text-center">
                                {item.no_antrean}
                            </TableCell>
                            <TableCell className="w-[180px] text-center">
                                {item.kode_booking}
                            </TableCell>
                            <TableCell className="w-[250px] text-left">{item.nama}</TableCell>
                            <TableCell className="w-[150px] text-center">
                                {item.poliklinik}
                            </TableCell>
                            <TableCell className="w-[200px] text-left">
                                {item.dokter}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="my-5">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#"/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            1
                        </PaginationLink>
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
        </>
    );
};

export default GeneralTable;
