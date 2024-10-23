import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Switch} from "@/components/ui/switch";
import {Action} from "@/enums/action";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import {Subunit, Subunits, WorkUnit} from "@/types/work-unit";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CursorPagination from "@/components/ui/cursor-pagination";
import {usePatch} from "@/hooks/use-patch";

interface WorkUnitTableProps {
    selectedRecord: Subunit | null;
    selectRecord: React.Dispatch<React.SetStateAction<Subunit | null>>;
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null,
    fieldId: number,
    action: Action;
    parentUnit: WorkUnit | null,
    refreshTrigger: number;
}

const WorkUnitTable = (
    {
        selectRecord,
        setAction,
        permission,
        action,
        parentUnit,
        setShowAlert,
        refreshTrigger
    }: WorkUnitTableProps) => {
    const [serviceType, setServiceType] = useState<string>("1")
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(5);
    const {updateData, patchError} = usePatch();
    const {data, loading, error, getData} = useGet<Subunits>({
        url: `/work-unit?parent_id=${parentUnit?.id}&service_type=${serviceType}&is_parent_unit=0`,
        keyword: searchKeyword,
        take: takeData,
        cursor: cursor
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
    }

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );
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

    const handleUpdateQueueStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/work-unit/${id}/queue-status`,
            {status_antrian: status === 1 ? 0 : 1},
        )

        if (response.status_code === 200) {
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status antrean menjadi 
                ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
            reloadTable();
        }

    }

    const handleUpdateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/work-unit/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response.status_code === 200) {
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status menjadi 
                ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
            reloadTable();
        }
    }

    const reloadTable = () => {
        getData().catch(() => {
            toast({
                title: "Terjadi Kesalahan",
                description: "Terjadi kesalahan saat memperbarui data di tabel",
                duration: 4000,
            })
        });
    }

    useEffect(() => {
        if (error || patchError) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString() || patchError?.toString(),
                duration: 4000,
            })
        }
        setCursor(data?.pagination?.current_cursor || 0)
    }, [error, data, patchError])

    useEffect(() => {
        reloadTable();
    }, [refreshTrigger]);
    return (
        <>
            <div
                className="flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-center py-4 bg-white sticky top-0 z-10">
                <Input type="search" className="w-full md:w-1/3 min-w-40" placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
                <Select onValueChange={setServiceType} value={serviceType}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Pilih jenis layanan"/>
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectGroup>
                            <SelectItem value="0">
                                Unit Kerja
                            </SelectItem>
                            <SelectItem value="1">
                                Poliklinik
                            </SelectItem>
                            <SelectItem value="2">
                                Penunjang
                            </SelectItem>
                            <SelectItem value="3">
                                IGD
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Unit</TableHead>
                        <TableHead>Jenis Pelayanan</TableHead>
                        <TableHead>Kode BPJS</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Status Antrean</TableHead>
                        {
                            (permission?.can_delete || permission?.can_update) && (
                                <TableHead>Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        (loading && (action !== Action.UPDATE_STATUS && action !== Action.UPDATE_QUEUE_STATUS)) ? (
                            Array.from({length: 2}, (_, index) => (
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
                        ) : (
                            data?.results?.map((subunit: Subunit, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="font-medium">{cursor + (index + 1)}</TableCell>
                                            <TableCell className="font-medium">{subunit.nama_unit_kerja}</TableCell>
                                            <TableCell className="font-medium">
                                                {subunit.jenis_pelayanan === 0 && ('Unit Kerja')}
                                                {subunit.jenis_pelayanan === 1 && ('Poliklinik')}
                                                {subunit.jenis_pelayanan === 2 && ('Penunjang')}
                                                {subunit.jenis_pelayanan === 3 && ('IGD')}
                                            </TableCell>
                                            <TableCell
                                                className="font-medium">{subunit.kode_instalasi_bpjs || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    (permission?.can_update) ? (
                                                        <Switch
                                                            checked={subunit.status === 1}
                                                            onCheckedChange={
                                                                () => {
                                                                    selectRecord(subunit);
                                                                    setAction(Action.UPDATE_STATUS)
                                                                    handleUpdateStatus(Number(subunit.id), subunit.status)
                                                                }
                                                            }
                                                        />
                                                    ) : (subunit.status === 1 ? 'Aktif' : 'Non Aktif')
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    (permission?.can_update) ? (
                                                        <Switch
                                                            checked={subunit.status_antrian === 1}
                                                            onCheckedChange={
                                                                () => {
                                                                    selectRecord(subunit);
                                                                    setAction(Action.UPDATE_QUEUE_STATUS)
                                                                    handleUpdateQueueStatus(Number(subunit?.id), subunit.status_antrian)
                                                                }
                                                            }
                                                        />
                                                    ) : (subunit.status_antrian === 1 ? 'Aktif' : 'Non Aktif')
                                                }
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {
                                                        (permission?.can_update) && (
                                                            <Button
                                                                onClick={() => {
                                                                    selectRecord(subunit);
                                                                    setAction(Action.UPDATE_FIELDS)
                                                                }}
                                                                size="sm">
                                                                Update
                                                            </Button>
                                                        )
                                                    }
                                                    {(permission?.can_delete) && (
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(subunit);
                                                                setAction(Action.DELETE)
                                                                setShowAlert(true)
                                                            }}
                                                            size="sm" variant="outline">
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                )
                            })
                        )
                    }
                    {(data && data.results?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell
                                colSpan={permission?.can_delete || permission?.can_update ? 7 : 6}
                                className="text-center">
                                Data tidak ditemukan
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {
                (loading && (action !== Action.UPDATE_STATUS && action !== Action.UPDATE_QUEUE_STATUS)) ? (
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
                        itemsPerPageOptions={[5, 10, 15]}
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

export default WorkUnitTable
