import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {BedDTO} from "@/types/master";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import {Switch} from "@/components/ui/switch";

interface BedProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<BedDTO | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}

const BedTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: BedProps) => {
    const url: string = '/master/bed'
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<BedDTO[]>({
        url: url,
        keyword: searchKeyword,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
    };


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

    console.log(data)
    useEffect(() => {
        if (status === 'authenticated') {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                })
            });
        }
    }, [refreshTrigger, getData, status])
    return (
        <>
            <Input type="search" className="w-full md:w-1/3" placeholder="Cari data ..."
                   onChange={debouncedChangeSearch}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Kasur</TableHead>
                        <TableHead>Nama Kamar</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Status Kasur</TableHead>
                        <TableHead>Status</TableHead>
                        {
                            (permission?.can_update || permission?.can_delete) && (
                                <TableHead>Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((bed: BedDTO, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{bed?.nama_bed}</TableCell>
                                        <TableCell className="font-medium">{bed?.kamar?.nama_kamar}</TableCell>
                                        <TableCell
                                            className="font-medium">{bed?.keterangan}</TableCell>
                                        <TableCell className="font-medium">{bed?.status_bed}</TableCell>
                                        <TableCell>
                                            {
                                                permission?.can_update ? (

                                                    <Switch
                                                        checked={bed.status === 1}
                                                        onCheckedChange={
                                                            () => {
                                                                selectRecord(bed);
                                                                setAction(Action.UPDATE_STATUS)
                                                            }
                                                        }
                                                    />
                                                ) : (bed.status === 1 ? 'Aktif' : 'Non Aktif')
                                            }
                                        </TableCell>
                                        {
                                            (permission?.can_update || permission?.can_delete) && (
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {
                                                            permission.can_update && (
                                                                <Button
                                                                    onClick={() => {
                                                                        selectRecord(bed);
                                                                        setAction(Action.UPDATE_FIELDS)
                                                                    }}
                                                                    size="sm">
                                                                    Update
                                                                </Button>
                                                            )
                                                        }
                                                        {
                                                            permission?.can_delete && (
                                                                <Button
                                                                    onClick={() => {
                                                                        selectRecord(bed);
                                                                        setAction(Action.DELETE)
                                                                        setAlertDelete(true)
                                                                    }}
                                                                    size="sm" variant="outline">
                                                                    Hapus
                                                                </Button>
                                                            )
                                                        }
                                                    </div>
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                </React.Fragment>
                            )
                        })
                    }
                    {(data && data?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
                    {
                        loading || status == 'loading' && (
                            Array.from({length: 4}, (_, index: number) => (
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
                                        {
                                            (permission?.can_update || permission?.can_delete) && (
                                                <TableCell className="text-center flex gap-4">
                                                    <Skeleton className="h-10 w-16 rounded-lg"/>
                                                    <Skeleton className="h-10 w-16 rounded-lg"/>
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                )
                            ))
                    }
                </TableBody>
            </Table>

        </>
    )
}

export default BedTable
