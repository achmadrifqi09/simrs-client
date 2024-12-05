import React, {useCallback, useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import {WorkUnit} from "@/types/work-unit";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";
import UpdateDialog from "@/app/(root)/bpjs/unit/components/update-dialog";

const InternalUnit = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const {status} = useSession()
    const [selectedWorkUnit, setSelectedWorkUnit] = useState<WorkUnit | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const {data, loading, error, getData} = useGet<WorkUnit[]>({
        isGuest: true,
        url: '/work-unit/queue-unit',
        keyword: searchKeyword,
    })

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (refreshTrigger === 0) setRefreshTrigger(1)
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
    };

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    const handleOpenUpdateDialog = (workUnit: WorkUnit) => {
        setSelectedWorkUnit(workUnit)
        setShowDialog(true)
    }

    const onRefresh = () => setRefreshTrigger(prev => prev + 1);

    useEffect(() => {
        if (status === 'authenticated' && refreshTrigger !== 0) {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data",
                    duration: 4000,
                })
            });
        }
    }, [refreshTrigger, getData, status]);

    useEffect(() => {
        if (error) {
            toast({
                title: 'Terjadi kesalahan',
                description: error.toString()
            })
        }
    }, [error]);

    return (
        <Section>
            <Heading headingLevel="h5" variant="section-title">
                Unit Internal
            </Heading>
            <div className="flex gap-4 items-center">
                <Input
                    type="search" placeholder="Nama poliklinik .."
                    onChange={debouncedChangeSearch}/>
            </div>
            <ul className="mt-4 space-y-2">
                {
                    data?.map((polyclinic: WorkUnit, index: number) => {
                        return (
                            <li
                                className="p-3 rounded-md text-sm bg-gray-50"
                                key={index}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="capitalize font-medium">{polyclinic.nama_unit_kerja.toLocaleLowerCase()}</p>
                                        <div className="flex gap-2 items-center mt-2">
                                            <span>Kode</span>
                                            <span>{polyclinic.kode_instalasi_bpjs}</span>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleOpenUpdateDialog(polyclinic)}>
                                        Update kode
                                    </Button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            {
                (data?.length === 0) && (
                    <div className="p-3 rounded-md text-sm bg-gray-50 h-16 flex items-center justify-center">
                        <p>Data tidak ditemukan</p>
                    </div>
                )
            }
            {
                loading && (
                    <div className="space-y-2">
                        {
                            Array.from({length: 2}, (_, i: number) => {
                                return <Skeleton className="w-full h-16" key={i}/>
                            })
                        }
                    </div>

                )
            }
            <UpdateDialog
                workUnit={selectedWorkUnit}
                setWorkUnit={setSelectedWorkUnit}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onRefresh={onRefresh}
            />
        </Section>
    )

}

export default InternalUnit;