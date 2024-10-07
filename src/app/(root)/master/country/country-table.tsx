import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {CountryDTO} from "@/types/master";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Switch} from "@/components/ui/switch";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

interface CountryTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<CountryDTO | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete:  React.Dispatch<React.SetStateAction<boolean>>
}

const CountryTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete
    }: CountryTableProps) => {
    const url: string = '/master/country'
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<CountryDTO[]>({
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
                        <TableHead>Nama Negara</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((country: CountryDTO, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{country.nama_negara}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={country.status === 1}
                                                onCheckedChange={
                                                    () => {
                                                        selectRecord(country);
                                                        setAction(Action.UPDATE_STATUS)
                                                    }
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        selectRecord(country);
                                                        setAction(Action.UPDATE_FIELDS)
                                                    }}
                                                    size="sm">
                                                    Update
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        selectRecord(country);
                                                        setAction(Action.DELETE)
                                                        setAlertDelete(true)
                                                    }}
                                                    size="sm" variant="outline">
                                                    Hapus
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        })
                    }
                    {(data && data.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
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

export default CountryTable
