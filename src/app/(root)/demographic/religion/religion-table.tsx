import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {Religion} from "@/types/religion";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";

interface ReligionTableProps {
    refreshTrigger: number;
    onUpdateReligion: (religion: Religion) => void
    onDeleteReligion: (id: number) => void
}

const ReligionTable = ({refreshTrigger, onUpdateReligion, onDeleteReligion}: ReligionTableProps) => {
    const url: string = '/religion'
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
        getData().catch(() => {
            toast({
                title: "Terjadi Kesalahan",
                description: "Terjadi kesalahan saat memperbarui data di tabel",
                duration: 4000,
            })
        });
    }, [refreshTrigger, getData]);

    return (
        <>
            <Input type="search" className="w-full md:w-1/3" placeholder="Cari data agama"
                   onChange={debouncedChangeSearch}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Agama</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.map((religion: Religion, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell className="font-medium">{religion.nama_agama}</TableCell>
                                        <TableCell>{religion.status === 1 ? 'Aktif' : 'Non Aktif'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => onUpdateReligion(religion)}
                                                    size="sm">
                                                    Update
                                                </Button>
                                                <Button
                                                    onClick={() => onDeleteReligion(religion.id_ms_agama)}
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
                </TableBody>
            </Table>

        </>
    )
}

export default ReligionTable