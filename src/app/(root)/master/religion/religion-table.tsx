import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {Religion} from "@/types/master";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Switch} from "@/components/ui/switch";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";

interface ReligionTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<Religion | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}

const ReligionTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: ReligionTableProps) => {
    const url: string = '/master/religion'
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<Religion[]>({
        url: url,
        keyword: searchKeyword,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
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

    useEffect(() => {
        if (status === 'authenticated' && refreshTrigger !== 0) {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                })
            });
        }
    }, [refreshTrigger, getData, status]);

    return (
        <>
            <Input type="search" className="w-full md:w-1/3" placeholder="Cari data ..."
                   onChange={debouncedChangeSearch}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Agama</TableHead>
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
                        data?.map((religion: Religion, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{religion.nama_agama}</TableCell>
                                        <TableCell>
                                            {
                                                permission?.can_update ? (

                                            <Switch
                                                checked={religion.status === 1}
                                                onCheckedChange={
                                                    () => {
                                                        selectRecord(religion);
                                                        setAction(Action.UPDATE_STATUS)
                                                    }
                                                }
                                            />
                                                ) : (religion.status === 1 ? 'Aktif' : 'Non Aktif')
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
                                                                        selectRecord(religion);
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
                                                                        selectRecord(religion);
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
                    {(data && data.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={(permission?.can_update || permission?.can_delete) ? 4 : 3} className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
                    {
                        loading || status === 'loading' && (
                            Array.from({length: 4}, (_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-16 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-8 w-12 rounded-lg"/>
                                    </TableCell>
                                    {
                                        (permission?.can_delete || permission?.can_update) && (
                                            <TableCell className="text-center flex gap-4">
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>

        </>
    )
}

export default ReligionTable
