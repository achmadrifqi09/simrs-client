'use client';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import ListDoctor from '@/app/(root)/queue/(guest)/unit/[unit_code]/components/list-doctor';
import { useParams } from 'next/navigation';
import useGet from '@/hooks/use-get';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkUnit } from '@/types/work-unit';
import { toast } from '@/hooks/use-toast';

type SelectDoctorProps = {
    unit_code: string;
};

const SelectDoctor = () => {
    const param = useParams<SelectDoctorProps>();
    const { data, loading, error } = useGet<WorkUnit>({
        isGuest: true,
        url: `/work-unit/queue-unit/${param.unit_code}`,
        keyword: '',
    });

    const handleBackButton = () => {
        if (history) history.back();
    };

    useEffect(() => {
        if (error) {
            toast({
                title: 'Terjadi Kesalahan',
                description: error?.toString(),
            });
        }
    }, [error]);

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl pb-6">
            <div className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                {loading ? (
                    <Skeleton className="h-10 w-24 absolute left-0 hidden md:block" />
                ) : (
                    <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                        Kembali
                    </Button>
                )}
                <div>
                    {loading && !data ? (
                        <Skeleton className="h-6 md:w-48" />
                    ) : (
                        <h4 className="text-xl font-semibold">{data?.nama_unit_kerja}</h4>
                    )}
                </div>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto mt-4 custom-scroll">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 h-max">
                    <ListDoctor unitCode={param.unit_code} />
                </div>
            </div>
        </div>
    );
};

export default SelectDoctor;
