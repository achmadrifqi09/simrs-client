'use client';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useCallback, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleMinus, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SelectSearch from '@/components/ui/select-search';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useGet from '@/hooks/use-get';
import { Register, RegisterResult } from '@/types/register';
import { dateFormatter } from '@/utils/date-formatter';
import { WorkUnit } from '@/types/work-unit';
import debounce from 'debounce';
import CancelDialog from '@/app/(root)/register/onsite/cancel-dialog';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface RegisterProps {
    onRefresh: () => void;
    refreshTrigger: number;
}

const RegisterTable = ({ onRefresh, refreshTrigger }: RegisterProps) => {
    const [idUnit, setIdUnit] = useState<number | null>(null);
    const [guarantorType, setGuarantorType] = useState<number | null>(null);
    const [patientType, setPatientType] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const { status } = useSession();
    const [id, setId] = useState<number | undefined>();
    const [cursor, setCursor] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('/registration');
    const { data, loading, getData } = useGet<Register>({
        url: url,
        keyword: searchKeyword,
        cursor: cursor,
    });
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
        setCursor(0);
    };

    const debouncedChangeSearch = useCallback(debounce(handleChangeSearch, 500), []);
    const resetFilter = () => {
        setIdUnit(null);
        setUrl('/registration');
        setGuarantorType(null);
        setPatientType(null);
        setShowFilter(false);
    };

    const handleFilter = () => {
        let baseUrl = '/registration';
        if (idUnit) {
            baseUrl = `${baseUrl}?id_unit=${idUnit}`;
        }

        if (patientType) {
            baseUrl = baseUrl.includes('?')
                ? `${baseUrl}&patient_type=${patientType}`
                : `${baseUrl}?patient_type=${patientType}`;
        }

        if (guarantorType) {
            baseUrl = baseUrl.includes('?')
                ? `${baseUrl}&guarantor_type=${guarantorType}`
                : `${baseUrl}?guarantor_type=${guarantorType}`;
        }

        setUrl(baseUrl);
        setShowFilter(false);
    };

    useEffect(() => {
        if (status === 'authenticated' && refreshTrigger !== 0) {
            getData().catch(() => {
                toast({
                    title: 'Terjadi Kesalahan',
                    description: 'Terjadi kesalahan saat memperbarui data di tabel',
                    duration: 4000,
                });
            });
        }
    }, [status, refreshTrigger]);
    return (
        <div className="w-full">
            <CancelDialog setShow={setShow} show={show} onRefresh={onRefresh} id={id} />

            <div>
                <div className="flex w-full justify-between mb-4 gap-4">
                    <Input
                        type="text"
                        id="fieldSearch"
                        name="fieldSearch"
                        className="w-full md:w-1/3"
                        placeholder="Cari data ..."
                        onChange={debouncedChangeSearch}
                    />
                    <Popover open={showFilter} onOpenChange={setShowFilter}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost">
                                <Filter />
                                Filter
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[20em] space-y-3">
                            <div>
                                <Label>Poli</Label>
                                <SelectSearch<WorkUnit>
                                    url="/work-unit/queue-unit"
                                    labelName="nama_unit_kerja"
                                    valueName="id"
                                    defaultValue={idUnit || undefined}
                                    onChange={(value: string | number | null) => setIdUnit(Number(value) || null)}
                                />
                                <Select
                                    onValueChange={(value) => setGuarantorType(Number(value))}
                                    defaultValue={guarantorType?.toString() || ''}
                                >
                                    <SelectTrigger className="w-full mt-4">
                                        <SelectValue placeholder="Pilih Penjamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Umum</SelectItem>
                                            <SelectItem value="2">BPJS</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select
                                    onValueChange={(value) => setPatientType(Number(value))}
                                    defaultValue={patientType?.toString() || ''}
                                >
                                    <SelectTrigger className="w-full mt-4">
                                        <SelectValue placeholder="Pilih Jenis Pasien" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Lama</SelectItem>
                                            <SelectItem value="2">Baru</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-x-2">
                                <Button size="sm" variant="outline" onClick={resetFilter}>
                                    Reset Filter
                                </Button>
                                <Button size="sm" variant="default" onClick={handleFilter}>
                                    Terapkan
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Pasien</TableHead>
                            <TableHead>Kode RM</TableHead>
                            <TableHead>No Registrasi</TableHead>
                            <TableHead>Tanggal Daftar</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>DPJP</TableHead>
                            <TableHead>Jenis Penjamin</TableHead>
                            <TableHead>Jenis Pasien</TableHead>
                            <TableHead>Status Batal</TableHead>
                            <TableHead className="text-sm">Status Kirim BPJS</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data?.results?.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center">
                                    Data tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                        {data?.results?.map((register: RegisterResult, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{register.antrian?.nama_pasien}</TableCell>
                                        <TableCell>{register.kode_rm}</TableCell>
                                        <TableCell>{register.nomor_registrasi}</TableCell>
                                        <TableCell>{dateFormatter(new Date(register.tgl_daftar))}</TableCell>
                                        <TableCell>{register.antrian?.jadwal_dokter?.unit?.nama_unit_kerja}</TableCell>
                                        <TableCell>
                                            {register.antrian?.jadwal_dokter?.pegawai?.gelar_depan}{' '}
                                            {register.antrian?.jadwal_dokter?.pegawai?.nama_pegawai}{' '}
                                            {register.antrian?.jadwal_dokter?.pegawai?.gelar_belakang}
                                        </TableCell>
                                        <TableCell>
                                            {Number(register.antrian?.jenis_penjamin === 2) ? 'BPJS' : 'Umum'}
                                        </TableCell>
                                        <TableCell>
                                            {Number(register.antrian?.jenis_pasien === 1) ? 'Lama' : 'Baru'}
                                        </TableCell>
                                        <TableCell>
                                            {Number(register.status_batal === 1) ? (
                                                <Badge className="bg-red-600 mx-auto">Ya</Badge>
                                            ) : (
                                                <Badge className="bg-green-600">Tidak</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {Number(register.status_kirim_bpjs === 1) ? (
                                                <CircleCheck className="text-green-500" />
                                            ) : (
                                                <CircleMinus className="text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {
                                                    <Button size="sm" disabled={register.status_batal === 1} asChild>
                                                        <Link
                                                            href={
                                                                Number(register.antrian?.jenis_pasien === 2) &&
                                                                !register?.kode_rm
                                                                    ? `/register/onsite/patient?QUID=${register.antrian?.id_antrian}`
                                                                    : `/register/onsite/${register.id}?rm=${register.kode_rm}`
                                                            }
                                                        >
                                                            {register.status_batal === 1 ? 'Detail' : 'Detail'}
                                                        </Link>
                                                    </Button>
                                                }
                                                {
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShow(true);
                                                            setId(register.id);
                                                        }}
                                                        disabled={register.status_batal === 1}
                                                    >
                                                        {register.status_batal === 1 ? 'Batal' : 'Batal'}
                                                    </Button>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RegisterTable;
