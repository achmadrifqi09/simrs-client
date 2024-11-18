import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Switch} from "@/components/ui/switch";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Permission} from "@/types/permission";
import {FieldOfWorkUnit} from "@/types/work-unit";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

interface FieldOfWorkUnitTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<FieldOfWorkUnit | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null;
    action: Action;
}

const FieldOfWorkUnitTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission,
        action
    }: FieldOfWorkUnitTableProps) => {

    const {status} = useSession();
    const [fieldOfWorkUnitSearch, setFieldOfWorkUnitSearch] = useState<string>('');
    const {data, loading, error, getData} = useGet<FieldOfWorkUnit[]>({
        url: '/field-of-work-unit',
        keyword: fieldOfWorkUnitSearch,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setFieldOfWorkUnitSearch(keyword);
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
            <div className="py-2 sticky top-0 bg-white w-full z-10">
                <Input type="text" id="fieldSearch" name="fieldSearch" className="w-full md:w-1/3 min-w-40 mb-4"
                       placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Bidang</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        (loading && action !== Action.UPDATE_STATUS) ? (
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

                            data?.map((fieldOfWorkUnit: FieldOfWorkUnit, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell
                                                className="font-medium">{fieldOfWorkUnit?.nama_bidang || '-'}</TableCell>
                                            <TableCell>
                                                {
                                                    (permission?.can_update) ? (
                                                        <Switch
                                                            checked={fieldOfWorkUnit.status === 1}
                                                            onCheckedChange={
                                                                () => {
                                                                    selectRecord(fieldOfWorkUnit);
                                                                    setAction(Action.UPDATE_STATUS)
                                                                }
                                                            }
                                                        />
                                                    ) : (fieldOfWorkUnit.status === 1 ? 'Aktif' : 'Non Aktif')
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="default"
                                                        size="sm" asChild>
                                                        <Link
                                                            href={`/work-unit/${fieldOfWorkUnit.id}?field_name=${fieldOfWorkUnit.nama_bidang}`}>
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                    {
                                                        (permission?.can_update) && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    selectRecord(fieldOfWorkUnit);
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
                                                                selectRecord(fieldOfWorkUnit);
                                                                setAction(Action.DELETE)
                                                                setAlertDelete(true)
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

export default FieldOfWorkUnitTable
