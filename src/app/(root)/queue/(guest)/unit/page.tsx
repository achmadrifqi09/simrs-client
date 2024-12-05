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
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {data, loading, error} = useGet<WorkUnit[]>({
        isGuest: true,
        url: '/work-unit/queue-unit?service_type=1',
        keyword: searchKeyword,
    })

    const {data:supportingUnits, loading:loadingSupportingUnit, error: errorSupportingUnit} = useGet<WorkUnit[]>({
        isGuest: true,
        url: '/work-unit/queue-unit?service_type=2',
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
                duration: 10000,
            })
        }

        if (errorSupportingUnit) {
            toast({
                title: "Terjadi Kesalahan",
                description: errorSupportingUnit?.toString(),
                duration: 10000,
            })
        }
    }, [error, errorSupportingUnit]);


    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10 py-8 px-8">
                <Input
                    className="max-w-[24em]"
                    placeholder="Cari poliklinik/penunjang ..."
                    type="search"
                    onChange={debouncedChangeSearch}
                />
                <Button variant="outline" asChild>
                    <Link href="/queue/unit/reprint-ticket">
                        <Printer className="w-4 h-4 mr-2"/>
                        <span>Cetak Ulang Tiket</span>
                    </Link>
                </Button>
            </div>
            <div className="h-full grid grid-cols-1 lg:grid-cols-7 2xl:grid-cols-5 overflow-hidden mb-8 mx-6">
                <div className="h-full lg:col-span-5 2xl:col-span-4 flex flex-col overflow-hidden lg:pr-4">
                    <div className="w-full bg-white sticky top-0 z-10 pb-2.5 px-2.5">
                        <p className="text-gray-700 font-medium">Daftar Poliklinik</p>
                    </div>
                    <div className="rounded-md pb-6 overflow-auto flex-1 px-2.5 custom-scroll">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                            {loading ? (
                                Array.from({length: 3}, (_, index) => (
                                    <Skeleton className="h-[72px] w-full rounded-xl" key={index}/>
                                ))
                            ) : (
                                data?.map((polyclinic: WorkUnit) => (
                                    <SolidCard
                                        key={polyclinic.id}
                                        disabled={!polyclinic?.kode_instalasi_bpjs}
                                        type={polyclinic?.kode_instalasi_bpjs ? 'link' : 'button'}
                                        href={`/queue/unit/${polyclinic.kode_instalasi_bpjs}`}
                                        className="text-center"
                                    >
                                        <p className="font-medium">{polyclinic.nama_unit_kerja}</p>
                                    </SolidCard>
                                ))
                            )}
                            {(data && data.length === 0 && !loading) && (
                                <p className="text-gray-600 mt-2 text-sm">Mohon maaf, poliklinik tidak ditemukan</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-full lg:col-span-2 2xl:col-span-1 flex flex-col overflow-hidden lg:border-l lg:border-l-gray-300 lg:pl-4">
                    <div className="w-full bg-white sticky top-0 z-10 px-2.5 pb-2.5">
                        <p className="text-gray-700 font-medium">Daftar Poliklinik Penunjang</p>
                    </div>
                    <div className="rounded-md flex-1 pb-6 overflow-auto px-2.5 custom-scroll">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            {loadingSupportingUnit ? (
                                Array.from({length: 2}, (_, index) => (
                                    <Skeleton className="h-[72px] w-full rounded-xl" key={index}/>
                                ))
                            ) : (
                                supportingUnits?.map((supportingUnit: WorkUnit) => (
                                    <SolidCard
                                        key={supportingUnit.id}
                                        href={`/queue/unit/${supportingUnit.kode_instalasi_bpjs}`}
                                    >
                                        <p className="font-medium">{supportingUnit.nama_unit_kerja}</p>
                                    </SolidCard>
                                ))
                            )}
                            {(supportingUnits && supportingUnits.length === 0 && !loading) && (
                                <p className="text-gray-600 mt-2 text-sm">Mohon maaf, poliklinik penunjang tidak ditemukan</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default QueuePolyclinic
