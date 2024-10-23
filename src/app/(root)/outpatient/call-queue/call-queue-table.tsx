import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {PolyclinicCounter} from "@/types/outpatient";


const CallQueueTable = () => {
    const [callQueueSearch, setCallQueueSearch] = useState<string>('');
    const {data, loading, error} = useGet<PolyclinicCounter[]>({
        url: '/work-unit/polyclinic/counter',
        keyword: callQueueSearch,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setCallQueueSearch(keyword);
    }

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    useEffect(() => {
        if (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString(),
                duration: 4000,
            })
        }
    }, [error])

    return (
        <>
            <div className="py-2 sticky top-0 bg-white w-full z-10">
                <Input type="text" id="fieldSearch" name="fieldSearch" className="w-full md:w-1/3 min-w-40 mb-4"
                       placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Poliklinik</TableHead>
                        <TableHead>Jumlah Antrean</TableHead>
                        <TableHead>Selesai</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        loading ? (
                            Array.from({length: 4}, (_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-16 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center flex gap-4">
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (

                            data?.map((polyclinicCounter: PolyclinicCounter, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell
                                                className="font-medium">{polyclinicCounter?.nama_unit_kerja}
                                            </TableCell>
                                            <TableCell
                                                className="font-medium">{polyclinicCounter?.total_antrean}
                                            </TableCell>
                                            <TableCell
                                                className="font-medium">{polyclinicCounter?.total_antrean_selesai}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="default"
                                                        size="sm" asChild>
                                                        <Link
                                                            href={`/outpatient/call-queue/${polyclinicCounter.id}?poly_name=${polyclinicCounter.nama_unit_kerja}`}>
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                )
                            })
                        )
                    }
                    {(data && data.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-[68.5px]">Data tidak
                                ditemukan</TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>

        </>
    )
}

export default CallQueueTable
