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
import {Employee, type EmployeePagination} from "@/types/employee";
import CursorPagination from "@/components/ui/cursor-pagination";
import {usePatch} from "@/hooks/use-patch";

interface EmployeeTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<Employee | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null;
    action: Action;
    onRefresh: () => void,
}

const EmployeeTable = ({
                           refreshTrigger,
                           selectRecord,
                           setAction,
                           setAlertDelete,
                           permission,
                           action,
                       }: EmployeeTableProps) => {
    const [localResults, setLocalResults] = useState<Employee[]>([]);
    const {status} = useSession();
    const [fieldOfEmployeeSearch, setEmployeeSearch] = useState<string>('');
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const {data, loading, error, getData} = useGet<EmployeePagination>({
        url: '/employee',
        keyword: fieldOfEmployeeSearch,
        take: takeData,
        cursor: cursor
    })
    const handleChangeDataPerPage = (value: number) => {
        setTakeData(value);
        setCursor(0);
    };

    const handleNextPage = () => {
        setCursor(prevCursor => prevCursor + takeData);
    };

    const handlePreviousPage = () => {
        const newCursor = Math.max(0, cursor - takeData);
        setCursor(newCursor);
    };
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
        setCursor(data?.pagination?.current_cursor || 0)
    }, [data]);

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
    }, [refreshTrigger, getData]);

    useEffect(() => {
        if (data?.results) {
            setLocalResults(data.results);
        }
    }, [data]);
    const {updateData} = usePatch();
    const updateEmployeeStatus = async (id: number | undefined, currentStatus: number | undefined) => {
        const response = await updateData(`/employee/${id}/status`, {status_aktif: currentStatus === 1 ? 0 : 1});

        if (response) {
            setLocalResults(prevResults =>
                prevResults.map(employee =>
                    employee.id_pegawai === id
                        ? {...employee, status_aktif: currentStatus === 1 ? 0 : 1}
                        : employee
                )
            );
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status Pegawai ${response?.data?.nama_pegawai} menjadi ${currentStatus === 1 ? "Tidak Aktif" : "Aktif"}`,
                duration: 4000,
            });
        }
    };
    return (
        <>
            <div className="py-2 sticky top-0 bg-white w-full z-10 space-y-4">
                <Input type="text" id="fieldSearch" name="fieldSearch" className="w-full md:w-1/3 min-w-40"
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
                        <TableHead>Email</TableHead>
                        <TableHead>Jenis Pegawai</TableHead>
                        <TableHead>Unit Induk</TableHead>
                        <TableHead>Unit Kerja</TableHead>
                        <TableHead>Status</TableHead>
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
                            localResults?.map((fieldOfEmployee: Employee, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{fieldOfEmployee.nip_pegawai}</TableCell>
                                            <TableCell>{
                                                (fieldOfEmployee.gelar_depan ? fieldOfEmployee.gelar_depan + ' ' : '') +
                                                fieldOfEmployee.nama_pegawai +
                                                (fieldOfEmployee.gelar_belakang ? ' ' + fieldOfEmployee.gelar_belakang : '')
                                            }</TableCell>
                                            <TableCell>{fieldOfEmployee.id_jenis_kelamin === 1 ? 'L' : 'P'}</TableCell>
                                            <TableCell>{fieldOfEmployee.hp}</TableCell>
                                            <TableCell>{fieldOfEmployee.email}</TableCell>
                                            <TableCell>{fieldOfEmployee?.nama_jenis_pegawai?.nama_jenis_pegawai}</TableCell>
                                            <TableCell>{fieldOfEmployee?.unit_induk?.nama_unit_kerja}</TableCell>
                                            <TableCell>{fieldOfEmployee?.unit_kerja?.nama_unit_kerja}</TableCell>
                                            <TableCell>
                                                {
                                                    (permission?.can_update) ? (
                                                        <Switch
                                                            checked={fieldOfEmployee.status_aktif === 1}
                                                            onCheckedChange={() => updateEmployeeStatus(fieldOfEmployee.id_pegawai, fieldOfEmployee.status_aktif)}
                                                        />
                                                    ) : (fieldOfEmployee.status_aktif === 1 ? 'Aktif' : 'Non Aktif')
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {
                                                        (permission?.can_update) && (
                                                            <Button
                                                                onClick={() => {
                                                                    selectRecord(fieldOfEmployee);
                                                                    setAction(Action.UPDATE_FIELDS)
                                                                }}
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/employee/form?id=${fieldOfEmployee.id_pegawai}`}>
                                                                    Update
                                                                </Link>
                                                            </Button>
                                                        )
                                                    }
                                                    {
                                                        (permission?.can_delete) && (
                                                            <Button
                                                                onClick={() => {
                                                                    selectRecord(fieldOfEmployee);
                                                                    setAction(Action.DELETE)
                                                                    setAlertDelete(true)
                                                                }}
                                                                size="sm" variant="outline">
                                                                Hapus
                                                            </Button>
                                                        )
                                                    }
                                                    {
                                                        (permission?.can_view) && (
                                                            <Button
                                                                variant='outline'
                                                                size='sm'
                                                                onClick={() => {
                                                                    selectRecord(fieldOfEmployee);
                                                                    setAction(Action.VIEW)
                                                                }}>
                                                                <Link
                                                                    href={`/employee/profile?id=${fieldOfEmployee.id_pegawai}`}>
                                                                    Profile
                                                                </Link>
                                                            </Button>
                                                        )
                                                    }
                                                </div>

                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                )
                            })
                        )
                    }
                    {
                        (data && data?.results?.length === 0 && !loading) && (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center h-[68.5px]">Data tidak
                                    ditemukan</TableCell>
                            </TableRow>
                        )
                    }
                    {
                        loading || status === 'loading' && (
                            Array.from({length: 4}, (_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-12 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-8 w-12 rounded-lg"/>
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

export default EmployeeTable
