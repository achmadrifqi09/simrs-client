import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {PatientType, type PatientTypePagination} from "@/types/patient";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import moment from 'moment-timezone';
import Link from "next/link";

interface PatientTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<PatientType | null>>;
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null;
}

const PatientTable = ({
                          refreshTrigger,
                          selectRecord,
                          setAction,
                          setAlertDelete,
                          permission
                      }: PatientTableProps) => {
    const url: string = '/patient';
    const {status} = useSession();
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error, getData} = useGet<PatientTypePagination>({
        url: url,
        keyword: searchKeyword,
    });

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
    }

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    const calculateAge = (birthDate: Date) => {
        const now = moment.tz('Asia/Jakarta');
        const birthMoment = moment(birthDate);
        const years = now.diff(birthMoment, 'years');
        const months = now.diff(birthMoment, 'months') % 12;
        return `${years} Tahun, ${months} Bulan`;
    };

    useEffect(() => {
        if (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString(),
                duration: 4000,
            });
        }
    }, [error]);

    useEffect(() => {
        if (status === 'authenticated' && refreshTrigger !== 0) {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                });
            });
        }
    }, [refreshTrigger, getData, status]);

    return (
        <>
            <Input type="search" className="w-full md:w-1/3" placeholder="Cari Nama/RM/BPJS/KTP"
                   onChange={debouncedChangeSearch}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>RM</TableHead>
                        <TableHead className="min-w-[16ch]">Nama Pasien</TableHead>
                        <TableHead className="min-w-[16ch]">Usia (T/B)</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>No.Ktp</TableHead>
                        <TableHead>No.BPJS</TableHead>
                        <TableHead className="min-w-[16ch]">Alamat</TableHead>
                        <TableHead className="min-w-[16ch]">Alamat KTP</TableHead>
                        {/*<TableHead>Status</TableHead>*/}
                        {
                            (permission?.can_update || permission?.can_delete) && (
                                <TableHead>Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.results?.map((patient: PatientType, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{patient.kode_rm}</TableCell>
                                        <TableCell className="min-w-[16ch]">{patient.nama_pasien}</TableCell>
                                        <TableCell>
                                            {calculateAge(patient.tgl_lahir)}
                                        </TableCell>
                                        <TableCell className="min-w-[16ch]">
                                            {patient.jenis_kelamin === 1 ? 'Laki-laki' : 'Perempuan'}
                                        </TableCell>
                                        <TableCell>{patient.no_identitas}</TableCell>
                                        <TableCell>{patient.no_bpjs}</TableCell>
                                        <TableCell className="min-w-[16ch]">{patient.alamat_tinggal}</TableCell>
                                        <TableCell className="min-w-[16ch]">{patient.alamat_asal}</TableCell>
                                        <TableCell>
                                            {
                                                (permission?.can_update || permission?.can_delete) && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm" asChild>
                                                            <Link href={`/patient/${patient.id_pasien}`}>
                                                                Update
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(patient);
                                                                setAction(Action.DELETE);
                                                                setAlertDelete(true);
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
                    {(data && data?.results?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={(permission?.can_update || permission?.can_delete) ? 10 : 9}
                                       className="text-center">
                                Data tidak ditemukan
                            </TableCell>
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
        </>
    )
}

export default PatientTable;
