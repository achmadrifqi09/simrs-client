import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import debounce from "debounce";
import {Input} from "@/components/ui/input";

type CounterDTO = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    status: number;
    keterangan: string | undefined;
    jenis_loket: number;
}

interface CounterProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<CounterDTO | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}

const CounterTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: CounterProps) => {
    const url: string = '/master/counter'
    const {status} = useSession();
    const [counterType, setCounterType] = useState<string>("1")
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<CounterDTO[]>({
        url: `${url}?type=${counterType}`,
        keyword: searchKeyword
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
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-center">
                <Input type="search" className="w-full md:w-1/3 min-w-40" placeholder="Cari data ..."
                       onChange={debouncedChangeSearch}/>
                <Select onValueChange={setCounterType} value={counterType}>
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Pilih loket"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="1">
                                Loket Admisi
                            </SelectItem>
                            <SelectItem value="2">
                                Loket Farmasi
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Loket</TableHead>
                        <TableHead>Jenis Loket</TableHead>
                        <TableHead>Status Loket</TableHead>
                        <TableHead>Keterangan</TableHead>
                        {
                            (permission?.can_update || permission?.can_delete) && (
                                <TableHead>Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((counter: CounterDTO, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell
                                            className="font-medium">{counter.nama_loket || '-'}</TableCell>
                                        <TableCell className="font-medium">
                                            {counter.jenis_loket === 1 && ('Loket Admisi')}
                                            {counter.jenis_loket === 2 && ('Loket Farmasi')}
                                        </TableCell>
                                        {
                                            permission?.can_update ? (
                                                <TableCell>
                                                    <Switch
                                                        checked={counter.status === 1}
                                                        onCheckedChange={
                                                            () => {
                                                                selectRecord(counter);
                                                                setAction(Action.UPDATE_STATUS)
                                                            }
                                                        }
                                                    />
                                                </TableCell>
                                            ) : (
                                                counter.status == 1 ? "Aktif" : "Non Aktif"
                                            )
                                        }
                                        <TableCell
                                            className="font-medium w-[16ch]">{counter.keterangan || '-'}</TableCell>
                                        {
                                            (permission?.can_update || permission?.can_delete) && (
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {
                                                            permission.can_update && (
                                                                <Button
                                                                    onClick={() => {
                                                                        selectRecord(counter);
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
                                                                        selectRecord(counter);
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
                    {
                        loading || status == 'loading' && (
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
                    {(data && data?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={permission?.can_delete || permission?.can_create ? 6 : 5}
                                       className="text-center">
                                Data tidak ditemukan
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export default CounterTable;
