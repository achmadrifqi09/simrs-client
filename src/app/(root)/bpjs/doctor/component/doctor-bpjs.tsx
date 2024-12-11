import Heading from '@/components/ui/heading';
import Section from '@/components/ui/section';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import axios, { AxiosResponse } from 'axios';
import { generateSignature } from '@/lib/crypto-js/cipher';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleHelp, ClipboardList } from 'lucide-react';
import { DoctorBPJS as DoctorBPJSType, DoctorsBPJS } from '@/types/doctor-bpjs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { doctorBPJSFilter } from '@/validation-schema/doctor-bpjs';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DoctorBPJS = () => {
    const formFilter = useForm<z.infer<typeof doctorBPJSFilter>>({
        resolver: zodResolver(doctorBPJSFilter),
        defaultValues: {
            specialist: '',
            service_type: '',
            service_date: '',
        },
    });
    const { handleSubmit, control } = formFilter;
    const [doctors, setDoctors] = useState<DoctorsBPJS | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();

    const onSubmitSearch = handleSubmit(async (values) => {
        if (status === 'authenticated') {
            try {
                setDoctors(null);
                setLoading(true);
                const response: AxiosResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/bpjs/v-claim/reference/${values.service_type}/doctor/${values.service_date}/specialist/${values.specialist}`,
                    {
                        headers: {
                            'client-signature': generateSignature(),
                            'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );
                if (response?.status === 200 && response.data?.data) {
                    setDoctors(response.data?.data);
                    setError(null);
                } else {
                    setError('Data tidak ditemukan');
                }
            } catch (error: any) {
                setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
            } finally {
                setLoading(false);
            }
        } else {
            toast({
                description: 'Masukkan nama poliklinik yang ingin anda cari',
            });
        }
    });

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
    return (
        <Section className="col-span-1">
            <Heading headingLevel="h5" variant="section-title">
                Data Dokter BPJS
            </Heading>
            <div>
                <Form {...formFilter}>
                    <form onSubmit={onSubmitSearch}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 items-end">
                            <FormField
                                control={control}
                                name="specialist"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Spesialis Dokter</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="service_date"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <span>Tgl layanan</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <CircleHelp className="w-4 h-4 text-gray-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs text-gray-500">
                                                                Jadwal dokter yang terdaftar di HFIS
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" className="block" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="service_type"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Jenis layanan</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Jenis layanan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Rawat Inap</SelectItem>
                                                        <SelectItem value="2">Rawat Jalan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <Button variant="outline" type="submit" className="w-max">
                            Cari
                        </Button>
                    </form>
                </Form>
            </div>

            <ul className="mt-4 space-y-2">
                {doctors?.list?.map((doctor: DoctorBPJSType, index: number) => {
                    return (
                        <li className="p-3 rounded-md text-sm bg-gray-50" key={index}>
                            <p className="capitalize font-medium">{doctor.nama.toLocaleLowerCase()}</p>
                            <div className="flex gap-2 items-center mt-2">
                                <span>Kode</span>
                                <span>{doctor.kode}</span>
                                <button onClick={() => handleClipboard(doctor.kode)}>
                                    <ClipboardList className="text-gray-500 w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {!loading && error && (
                <div className="p-3 rounded-md text-sm bg-gray-50 h-16 flex items-center justify-center">
                    <p>{error}</p>
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
