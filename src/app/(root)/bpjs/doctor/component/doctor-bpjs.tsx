import Heading from '@/components/ui/heading';
import Section from '@/components/ui/section';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleCheck, ClipboardList } from 'lucide-react';
import { DoctorBPJS as DoctorBPJSType, InternalDoctors } from '@/types/doctor-bpjs';
import useGet from '@/hooks/use-get';

interface DoctorBPJSProps {
    internalDoctors: InternalDoctors | null;
}

const DoctorBPJS = ({ internalDoctors }: DoctorBPJSProps) => {
    const { data, error, loading } = useGet<DoctorBPJSType[] | null>({ url: '/bpjs/v-claim/reference/doctor' });
    const [doctors, setDoctors] = useState<DoctorBPJSType[] | null>(null);
    const [keyword, setKeyword] = useState<string>('');

    const handleClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            toast({
                description: `Kode ${text} disalin`,
                duration: 1000,
            });
            return await navigator.clipboard.writeText(text);
        } else {
            toast({
                description: `Kode ${text} disalin`,
                duration: 1000,
            });
            return document.execCommand('copy', true, text);
        }
    };

    const checkDoctorBPJSInInternalData = (dpjp: string) => {
        const filterDoctor = internalDoctors?.results.filter((value) => {
            return dpjp == value.kode_dpjp;
        });
        return filterDoctor && filterDoctor?.length > 0 ? true : false;
    };

    useEffect(() => {
        if (data) setDoctors(data);
    }, [data]);

    return (
        <Section className="col-span-1">
            <Heading headingLevel="h5" variant="section-title">
                Data Dokter BPJS
            </Heading>
            <div className="flex gap-4">
                <Input type="search" placeholder="Cari nama dokter.." onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <ul className="mt-4 space-y-2">
                {doctors &&
                    internalDoctors &&
                    doctors
                        ?.filter((doctor: DoctorBPJSType) => {
                            if (keyword === '') return doctor;
                            if (doctor?.namadokter.toLowerCase().includes(keyword.toLowerCase())) return doctor;
                        })
                        .map((doctor: DoctorBPJSType, index: number) => {
                            return (
                                <li
                                    className="p-3 rounded-md text-sm flex justify-between items-center gap-4 bg-gray-50"
                                    key={index}
                                >
                                    <div>
                                        <p className="capitalize font-medium">
                                            {doctor.namadokter.toLocaleLowerCase()}
                                        </p>
                                        <div className="flex gap-2 items-center mt-2">
                                            <span>Kode</span>
                                            <span>{doctor.kodedokter}</span>
                                            <button onClick={() => handleClipboard(doctor.kodedokter)}>
                                                <ClipboardList className="text-gray-500 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        {checkDoctorBPJSInInternalData(doctor.kodedokter) && (
                                            <CircleCheck className="text-green-600 w-6 h-6" />
                                        )}
                                    </div>
                                </li>
                            );
                        })}
            </ul>
            {!loading && error && (
                <div className="p-3 rounded-md text-sm bg-gray-50 h-16 flex items-center justify-center">
                    <p>{error.toString()}</p>
                </div>
            )}
            {loading && (
                <div className="space-y-2">
                    {Array.from({ length: 2 }, (_, i: number) => {
                        return <Skeleton className="w-full h-16" key={i} />;
                    })}
                </div>
            )}
        </Section>
    );
};

export default DoctorBPJS;
