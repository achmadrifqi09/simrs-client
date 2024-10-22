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
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import {WorkUnit} from "@/types/work-unit";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams} from "next/navigation";

interface WorkUnitTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<WorkUnit | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}
type WorkUnitParams = {
    id: string;
}

const WorkUnitTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: WorkUnitTableProps) => {
    const param = useParams<WorkUnitParams>()
    const [serviceType, setServiceType] = useState<string>("0")
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<WorkUnit[]>({
        url: `/work-unit?is_parent_unit=1&field_id=${param.id}`,
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

    const getRowLength = () => {
       return 4 + (permission?.can_update ? 2 : 0) + ((permission?.can_update && (serviceType === '1' || serviceType === '3')) ? 1 : 0)
    }
    return (
        <>
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-center">
                <Input type="search" className="w-full md:w-1/3 min-w-40" placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
                <Select onValueChange={setServiceType} value={serviceType}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Pilih loket"/>
                    </SelectTrigger>
                    <SelectContent>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((workUnit: WorkUnit, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{workUnit.nama_unit_kerja}</TableCell>
                                        <TableCell className="font-medium">
                                            {workUnit.jenis_pelayanan === 0 && ('Unit Kerja')}
                                            {workUnit.jenis_pelayanan === 1 && ('Poliklinik')}
                                            {workUnit.jenis_pelayanan === 2 && ('Penunjang')}
                                            {workUnit.jenis_pelayanan === 3 && ('IGD')}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                (permission?.can_update || permission?.can_update) ? (
                                                    <Switch
                                                        checked={workUnit.status === 1}
                                                        onCheckedChange={
                                                            () => {
                                                                selectRecord(workUnit);
                                                                setAction(Action.UPDATE_STATUS)
                                                            }
                                                        }
                                                    />
                                                ) : (workUnit.status === 1 ? 'Aktif' : 'Non Aktif')
                                            }
                                        </TableCell>
                                        {
                                            (permission?.can_update && (serviceType === '1' || serviceType === '3')) && (
                                                <TableHead>
                                                    <Switch
                                                        checked={workUnit.status === 1}
                                                        onCheckedChange={
                                                            () => {
                                                                selectRecord(workUnit);
                                                                setAction(Action.UPDATE_STATUS)
                                                            }
                                                        }
                                                    />
                                                </TableHead>
                                            )
                                        }
                                        <TableCell>
                                            {
                                                (permission?.can_update || permission?.can_delete) && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(workUnit);
                                                                setAction(Action.UPDATE_FIELDS)
                                                            }}
                                                            size="sm">
                                                            Update
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(workUnit);
                                                                setAction(Action.DELETE)
                                                                setAlertDelete(true)
                                                            }}
                                                            size="sm" variant="outline">
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        })
                    }
                    {(data && data.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
                    {
                        loading && (
                            Array.from({length: 2}, (_, index) => (
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
                                    <TableCell className="text-center">
                                        <Skeleton className="h-8 w-12 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center flex gap-4">
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                        <Skeleton className="h-10 w-16 rounded-lg"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>

        </>
    )
}

export default WorkUnitTable
