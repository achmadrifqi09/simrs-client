'use client';

import React, { useEffect, useState } from 'react';
import useGet from '@/hooks/use-get';
import { PatientType } from '@/types/patient';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { dateFormatter } from '@/utils/date-formatter';
import Heading from '@/components/ui/heading';
import Section from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';

interface PatientDataProps {
    setPatient: React.Dispatch<React.SetStateAction<PatientType | null>>;
}

const PatientData = ({ setPatient }: PatientDataProps) => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const [url] = useState<string>(`/patient/${searchParam.get('rm')}?identifier_type=1`);
    const { data, getData } = useGet<PatientType>({
        url: url,
    });
    useEffect(() => {
        if (!searchParam.get('rm')) {
            toast({
                description: 'Url tidak valid',
            });
            router.push('/register/onsite');
        }

        if (data) {
            setPatient(data);
        }
    }, [getData, data]);
    return (
        <>
            <Section className="h-max">
                <div className="flex justify-between items-center">
                    <Heading variant="section-title" headingLevel="h5">
                        Data Pasien
                    </Heading>
                    <Button size="icon" variant="ghost" asChild>
                        <Link href={`/patient/${data?.id_pasien}`}>Edit</Link>
                    </Button>
                </div>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 2xl:grid-cols-2  gap-4 text-sm">
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Kode RM</p>
                        <p className="px-4 py-2.5 bg-gray-50 roundedh-[40px]">{data?.kode_rm}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Nama Pasien</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded h-[40px]">{data?.nama_pasien}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Jenis Kelamin</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">
                            {data?.jenis_kelamin === 1 ? 'laki laki' : 'perempuan'}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Tanggal Lahir / Usia</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">
                            {data?.tgl_lahir ? dateFormatter(new Date(data?.tgl_lahir)) : '-'}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">No. BPJS</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded h-[40px]">{data?.no_bpjs ?? '-'}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Identitas Pasien</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">
                            {data?.identitas_pasien === 1 ? 'KTP' : data?.identitas_pasien === 2 ? 'Pasport' : '-'}{' '}
                            {data?.no_identitas}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Alamat Sekarang</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">{data?.alamat_tinggal}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Alamat Asal</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">{data?.alamat_asal}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">No.HP</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">{data?.no_hp}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Pekerjaan</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">{data?.nama_pekerjaan ?? '-'}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-gray-500">Tanggal Update</p>
                        <p className="px-4 py-2.5 bg-gray-50 rounded min-h-[40px]">
                            {data?.modified_at ? dateFormatter(new Date(data?.modified_at)) : '-'}
                        </p>
                    </div>
                </div>
            </Section>
        </>
    );
};
export default PatientData;
