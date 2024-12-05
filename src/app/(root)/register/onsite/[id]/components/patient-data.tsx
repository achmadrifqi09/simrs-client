"use client"

import React, {useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {PatientType} from "@/types/patient";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import Link from "next/link";


const PatientData = () => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const [url] = useState<string>(`/patient/${searchParam.get('rm')}?identifier_type=1`);
    const {data, getData} = useGet<PatientType>({
        url: url,
    })
    useEffect(() => {
        if (!searchParam.get('rm')) {
            toast({
                description: 'Url tidak valid'
            })
            router.push('/register/onsite');
        }
        getData()
    }, [getData]);
    return (
        <>
            <div className="flex flex-col mt-8 gap-4 text-sm">
                <div className="flex justify-between w-full">
                    <p>Kode RM</p>
                    <p>{data?.kode_rm}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Nama Pasien</p>
                    <p>{data?.nama_pasien}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Jenis Kelamin</p>
                    <p>{data?.jenis_kelamin === 1 ? 'laki laki' : 'perempuan'}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Tanggal Lahir / Usia</p>
                    {/*<p>{dateFormatter(new Date (data?.tgl_lahir))}</p>*/}
                </div>
                <div className="flex justify-between w-full">
                    <p>No. BPJS</p>
                    <p>{data?.no_bpjs}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Identitas Pasien</p>
                    <p>{data?.identitas_pasien === 1 ? 'KTP' : data?.identitas_pasien === 2 ? 'Pasport' : '-'} - {data?.no_identitas}
                    </p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Alamat Sekarang</p>
                    <p>{data?.alamat_tinggal}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Alamat Asal</p>
                    <p>{data?.alamat_asal}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>No.HP</p>
                    <p>{data?.no_hp}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Pekerjaan</p>
                    <p>{data?.nama_pekerjaan ?? '-'}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p>Tanggal Update</p>
                    {/*<p>{dateFormatter(new Date(data?.modified_at))}</p>*/}
                </div>
                <div>
                    <Button variant='outline' asChild>
                        <Link href={`/patient/${data?.id_pasien}`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}
export default PatientData
