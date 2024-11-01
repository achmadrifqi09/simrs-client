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
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";
import {Employee} from "@/types/employee";

interface EmployeeTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<Employee | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null;
    action: Action;
}

const EmployeeTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission,
        action
    }: EmployeeTableProps) => {

    const {status} = useSession();
    const [fieldOfEmployeeSearch, setEmployeeSearch] = useState<string>('');
    const {data, loading, error, getData} = useGet<Employee[]>({
        url: '/field-of-work-unit',
        keyword: fieldOfEmployeeSearch,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setEmployeeSearch(keyword);
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
            <div className="py-2 sticky top-0 bg-white w-full z-10 space-y-4">
                <Input type="text" id="fieldSearch" name="fieldSearch" className="w-full md:w-1/3 min-w-40 mb-4"
                       placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Nama Pegawai</TableHead>
                        <TableHead>JK</TableHead>
                        <TableHead>No.Hp</TableHead>
                        <TableHead>Jenis Pegawai</TableHead>
                        <TableHead>Unit Induk</TableHead>
                        <TableHead>Unit Kerja</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        loading && action !== Action.UPDATE_STATUS ? (
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

                                    <TableCell className="text-center flex gap-4">
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (

                            data?.map((fieldOfEmployee: Employee, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">-</TableCell>
                                            <TableCell className="font-medium">-</TableCell>
                                            <TableCell className="font-medium">-</TableCell>
                                            <TableCell className="font-medium">-</TableCell>
                                            <TableCell className="font-medium">-</TableCell>
                                            <TableCell
                                                className="font-medium">{fieldOfEmployee?.nama_pegawai || '-'}</TableCell>
                                            <TableCell>
                                                {
                                                    (permission?.can_update) ? (
                                                        <Switch
                                                            checked={fieldOfEmployee.status_aktif === 1}
                                                            onCheckedChange={
                                                                () => {
                                                                    selectRecord(fieldOfEmployee);
                                                                    setAction(Action.UPDATE_STATUS)
                                                                }
                                                            }
                                                        />
                                                    ) : (fieldOfEmployee.status_aktif === 1 ? 'Aktif' : 'Non Aktif')
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="default"
                                                        size="sm" asChild>
                                                        <Link
                                                            href={`/work-unit/${fieldOfEmployee.id_pelamar} ? 
                                                            field_name=${fieldOfEmployee.nama_pegawai}`}>
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                    {
                                                        (permission?.can_update) && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    selectRecord(fieldOfEmployee);
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
                                                                selectRecord(fieldOfEmployee);
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
                            <TableCell colSpan={10} className="text-center h-[68.5px]">Data tidak
                                ditemukan</TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>

        </>
    )
}

export default EmployeeTable
