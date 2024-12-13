import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { patientValidationSchema } from '@/validation-schema/queue-register';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { QueueInputPayload, RegisterResponse } from '@/types/queue-register';
import { capitalizeFirstLetter } from '@/utils/word-formatter';
import { usePost } from '@/hooks/use-post';
import { Loader2 } from 'lucide-react';
import AlertError from '@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/alert-error';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { generateSignature } from '@/lib/crypto-js/cipher';
import { PatientReference, Reference } from '@/types/patient-reference';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/const/month';

interface NewPatientFormProps {
    scheduleId: number;
    handlePrintTicket: (data: RegisterResponse) => void;
    patientType: number;
}

type Option = {
    label: string;
    value: string;
};

type DateType = {
    day?: string;
    month?: string;
    year?: string;
};

export default function NewPatientForm({ scheduleId, handlePrintTicket, patientType }: NewPatientFormProps) {
    const router = useRouter();
    const { postData, postLoading, postError } = usePost('/queue/new-patient', true);
    const [bpsjNumberError, setBpjsNumberError] = useState<string | null>(null);
    const [bpjsSerchingLoading, setBpjsSearchingLoading] = useState<boolean>(false);
    const [bpjsNumber, setBpjsNumber] = useState<string>('');
    const [isContinued, setIsContinued] = useState<boolean>(false);
    const [birtDateError, setBirthDateError] = useState<string | null>();
    const [selectedPatient, setSelectedPatient] = useState<Reference | null>(null);
    const [birthDate, setBirthDate] = useState<DateType>({
        day: '',
        month: '',
        year: '',
    });
    const newPatientForm = useForm<z.infer<typeof patientValidationSchema>>({
        resolver: zodResolver(patientValidationSchema),
        defaultValues: {
            nama_pasien: '',
            no_hp: '',
        },
    });

    const { handleSubmit, control } = newPatientForm;

    const isBirthDateField = (field?: string) => {
        return field === '' || field === undefined;
    };

    const isValidBirthDate = () => {
        return (
            !isBirthDateField(birthDate.day) && !isBirthDateField(birthDate.month) && !isBirthDateField(birthDate.year)
        );
    };

    const onSubmit = handleSubmit(async (values) => {
        if (![1, 3].includes(patientType)) {
            toast({
                description: 'Jenis pasien tidak valid',
            });
            router.back();
        }
        setBirthDateError(null);
        if (!isValidBirthDate()) {
            setBirthDateError('Tanggal lahir tidak lengkap');
            return;
        }

        const payload: QueueInputPayload = {
            nama_pasien: capitalizeFirstLetter(values.nama_pasien),
            jenis_pasien: 2,
            jenis_penjamin: Number(patientType) === 1 ? 2 : 1,
            id_jadwal_dokter: scheduleId,
            tgl_lahir: `${birthDate.day}-${birthDate.month}-${birthDate.year}`,
            no_rujukan: selectedPatient?.noKunjungan || undefined,
            no_bpjs: selectedPatient?.peserta.noKartu || undefined,
            kode_rm: selectedPatient?.peserta?.mr?.noMR || undefined,
            no_hp: values.no_hp,
        };

        const response = await postData(payload);
        if (response?.data) {
            handlePrintTicket(response.data);
        }
    });

    const resetBPJSNumberAttr = () => {
        setBpjsNumberError(null);
        setIsContinued(false);
        setSelectedPatient(null);
        newPatientForm.reset();
        newPatientForm.clearErrors();
    };

    const handleSearchPatinetByBPJSNumber = async () => {
        if (bpjsNumber.length < 13 || bpjsNumber.length > 13) {
            setBpjsNumberError('Nomor BPJS harus 13 digit');
            return;
        }

        resetBPJSNumberAttr();
        setBpjsSearchingLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/bpjs/v-claim/participant/${bpjsNumber}`,
                {
                    headers: {
                        'client-signature': generateSignature(),
                        'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                    },
                }
            );
            if (response.status === 200) {
                const patientBPJS: PatientReference = response.data?.data;
                if (patientBPJS?.rujukan?.length > 0) {
                    newPatientForm.setValue('nama_pasien', patientBPJS.rujukan[0].peserta.nama);
                    newPatientForm.setValue('no_hp', patientBPJS.rujukan[0].peserta.mr.noTelepon || '');
                    const [year, month, day] = patientBPJS.rujukan[0].peserta?.tglLahir?.split('-');
                    setBirthDate({
                        day: day || '',
                        month: month || '',
                        year: year || '',
                    });
                    setIsContinued(true);
                    setSelectedPatient(patientBPJS.rujukan[0]);
                }
            }
        } catch (error) {
            setBpjsNumberError(
                'Nomor tersebut tidak terdaftar pada BPJS, cek kembali nomor BPJS atau mendaftar Pasien Umum'
            );
        } finally {
            setBpjsSearchingLoading(false);
        }
    };

    return (
        <>
            {Number(patientType) == 1 && (
                <>
                    <p className="italic text-gray-600">
                        **) Jika anda tidak memiliki nomor BPJS silakan mendaftar pasien Umum
                    </p>
                    <div className="mt-6 mb-12">
                        <Label>Nomor BPJS</Label>
                        <div className="flex gap-4 items-start mt-3">
                            <div className="w-full">
                                <Input
                                    type="number"
                                    placeholder="Masukkan nomor BPJS"
                                    onChange={(e) => setBpjsNumber(e.target.value)}
                                />
                                {bpsjNumberError && (
                                    <span className="text-red-600 mt-2 block text-sm font-medium">
                                        {bpsjNumberError}
                                    </span>
                                )}
                            </div>
                            <Button onClick={handleSearchPatinetByBPJSNumber} disabled={bpjsSerchingLoading}>
                                {bpjsSerchingLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <span>Cari</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
            {(isContinued || Number(patientType) == 3) && (
                <>
                    {Number(patientType) === 1 && (
                        <h5 className="text-lg text-gray-900 font-semibold mb-4">Data Diri Pasien</h5>
                    )}
                    <Form {...newPatientForm}>
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <FormField
                                    control={control}
                                    name="nama_pasien"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Nama Pasien*</FormLabel>
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
                                    name="no_hp"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Nomor HP*</FormLabel>
                                                <FormControl className="relative">
                                                    <Input type="text" inputMode="numeric" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="mb-3.5 block">Tanggal Lahir</Label>
                                            <Select
                                                value={birthDate?.day}
                                                onValueChange={(value) => setBirthDate({ ...birthDate, day: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tanggal Lahir" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56 overflow-scroll">
                                                    {Array.from({ length: 31 }, (_, date: number) => {
                                                        return (
                                                            <SelectItem
                                                                value={
                                                                    date + 1 < 10
                                                                        ? `0${(date + 1).toString()}`
                                                                        : (date + 1).toString()
                                                                }
                                                                key={date}
                                                            >
                                                                {date + 1}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-3.5 block">Bulan Lahir</Label>
                                            <Select
                                                value={birthDate?.month}
                                                onValueChange={(value) => setBirthDate({ ...birthDate, month: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Bulan Lahir" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56 overflow-scroll">
                                                    {months.map((month: Option, i: number) => {
                                                        return (
                                                            <SelectItem value={month.value} key={i}>
                                                                {month.label}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-3.5 block">Tahun Lahir</Label>
                                            <Input
                                                type="number"
                                                placeholder="Tahun lahir"
                                                min="1945"
                                                max={new Date().getFullYear()}
                                                value={birthDate?.year}
                                                onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {birtDateError && (
                                        <span className="text-red-600 mt-2 block text-sm font-medium">
                                            {birtDateError}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <Button
                                    type="submit"
                                    disabled={postLoading || (!isContinued && Number(patientType) == 1)}
                                    className="min-w-[10em] mt-4"
                                >
                                    {postLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span>Loading</span>
                                        </>
                                    ) : (
                                        <span>Daftar</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    {postError && <AlertError message={postError} isShow={true} redirectUrl="/ambil-antrean" />}
                </>
            )}
        </>
    );
}
