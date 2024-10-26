import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {District, Districts} from "@/types/master";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import CursorPagination from "@/components/ui/cursor-pagination";
import {Permission} from "@/types/permission";

interface DistrictProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<District | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}

const DistrictTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: DistrictProps) => {
    const url: string = '/master/district'
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const {data, loading, error, getData} = useGet<Districts>({
        url: url,
        keyword: searchKeyword,
        take: takeData,
        cursor: cursor
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
        setCursor(0);
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
        if (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString(),
                duration: 4000,
            })
        }
    }, [error])

    useEffect(() => {
        setCursor(data?.pagination?.current_cursor || 0)
    }, [data]);

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
    }, [refreshTrigger, getData, status]);

    return (
        <>
            <Input type="search" className="w-full md:w-1/3" placeholder="Cari data ..."
                   onChange={debouncedChangeSearch}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Kecamatan</TableHead>
                        <TableHead>Kabupaten/Kota</TableHead>
                        {
                            (permission?.can_update || permission?.can_delete) && (
                                <TableHead>Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(data && data?.results?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={(permission?.can_update || permission?.can_delete) ? 4 : 3}
                                       className="text-center">Data tidak ditemukan
                            </TableCell>
                        </TableRow>
                    )}
                    {
                        loading || status == 'loading' ? (
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
                                    {
                                        (permission?.can_update || permission?.can_delete) && (
                                            <TableCell className="text-center flex gap-4">
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        ) : (
                            data?.results?.map((district: District, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="font-medium">{cursor + (index + 1)}</TableCell>
                                            <TableCell className="font-medium">{district.nama}</TableCell>
                                            <TableCell
                                                className="font-medium">{district.ms_kabkot?.nama || '-'}</TableCell>
                                            {
                                                (permission?.can_update || permission?.can_delete) && (
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {
                                                                permission.can_update && (
                                                                    <Button
                                                                        onClick={() => {
                                                                            selectRecord(district);
                                                                            setAction(Action.UPDATE_FIELDS)
                                                                        }}
                                                                        size="sm">
                                                                        Update
                                                                    </Button>
                                                                )
                                                            }
                                                            {
                                                                permission.can_delete && (
                                                                    <Button
                                                                        onClick={() => {
                                                                            selectRecord(district);
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
                </TableBody>
            </Table>
            <CursorPagination
                currentCursor={data?.pagination?.current_cursor || 0}
                take={takeData}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onItemsPerPageChange={handleChangeDataPerPage}
                hasMore={(data?.results?.length || 0) >= takeData}
            />
        </>
    )
}

export default DistrictTable;
