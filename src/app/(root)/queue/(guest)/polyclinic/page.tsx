"use client"

import React, {useCallback, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Printer} from 'lucide-react'
import SolidCard from "@/components/ui/solid-card";
import Link from "next/link";
import {WorkUnit} from "@/types/work-unit";
import {Skeleton} from "@/components/ui/skeleton"
import useGet from "@/hooks/use-get";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";

const QueuePolyclinic = () => {
    const url: string = '/work-unit/polyclinic'
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error} = useGet<WorkUnit[]>({
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
       if(error){
           toast({
               title: "Terjadi Kesalahan",
               description: error?.toString(),
               duration: 10000,
           })
       }
    }, [error]);


    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10 p-6">
                <Input
                    className="max-w-[24em]"
                    placeholder="Cari poliklinik"
                    type="search"
                    onChange={debouncedChangeSearch}
                />
                <Button variant="outline" asChild>
                    <Link href="/queue/polyclinic/reprint-ticket">
                        <Printer className="w-4 h-4 mr-2"/>
                        <span>Cetak Ulang Tiket</span>
                    </Link>
                </Button>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {loading ? (
                        Array.from({length: 3}, (_, index) => (
                            <Skeleton className="h-[72px] w-full rounded-xl" key={index}/>
                        ))
                    ) : (
                        data?.map((polyclinic: WorkUnit) => (
                            <SolidCard
                                key={polyclinic.id_unit_kerja}
                                href={`/queue/polyclinic/${polyclinic.id_unit_kerja}`}
                            >
                                <p className="font-medium">{polyclinic.nama_unit_kerja}</p>
                            </SolidCard>
                        ))
                    )}
                    {(data && data.length === 0 && !loading )&& (
                      <p className="text-gray-600 mt-2">Mohon maaf, poliklinik tidak ditemukan</p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default QueuePolyclinic