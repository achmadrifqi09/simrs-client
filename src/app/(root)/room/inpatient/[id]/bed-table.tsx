import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {Bed, Beds} from "@/types/master";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import {Switch} from "@/components/ui/switch";
import {useParams} from "next/navigation";
import CursorPagination from "@/components/ui/cursor-pagination";

interface BedProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<Bed | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
    action: Action
}

type RoomParam = {
    id: string;
}

const BedTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission,
        action
    }: BedProps) => {
    const useParam = useParams<RoomParam>()
    const url: string = '/master/bed'
    const {status} = useSession();
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<Beds>({
        url: `${url}?room_id=${useParam.id}`,
        keyword: searchKeyword,
        take: takeData,
        cursor: cursor
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
    };

    const handleChangeDataPerPage = (value: number) => {
        setTakeData(value);
        setCursor(0);
    };

    const handleNextPage = () => {
        if (data?.pagination?.current_cursor !== undefined) {
            setCursor(data.pagination.current_cursor + takeData);
        }
    };

    const handlePreviousPage = () => {
        const newCursor = Math.max(0, cursor - takeData);
        setCursor(newCursor);
    };

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    useEffect(() => {
        setCursor(data?.pagination?.current_cursor || 0)
    }, [data]);

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
                        ((loading || status == 'loading') && action !== Action.UPDATE_STATUS) ? (
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
                                <TableCell className="text-center">
                                    <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                </TableCell>
                                {(permission?.can_update || permission?.can_delete) && (
                                    <TableCell className="text-center flex gap-4">
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        data?.results?.map((bed: Bed, index: number) => {
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
                    )
                    }
                    {(data && data?.results?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={(permission?.can_update || permission?.can_delete) ? 7 : 6} className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
                    {
                        loading || status == 'loading' && (
                            Array.from({length: (permission?.can_update || permission?.can_delete) ? 7 : 6}, (_, index: number) => (
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
            {
                ((loading || status === 'loading') && action !== Action.UPDATE_STATUS) ? (
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-[128px] rounded-lg"/>
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                        </div>
                    </div>
                ) : (
                    <CursorPagination
                        currentCursor={data?.pagination?.current_cursor || 0}
                        take={takeData}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                        onItemsPerPageChange={handleChangeDataPerPage}
                        hasMore={(data?.results?.length || 0) >= takeData}
                    />
                )
            }
        </>
    )
}

export default BedTable
