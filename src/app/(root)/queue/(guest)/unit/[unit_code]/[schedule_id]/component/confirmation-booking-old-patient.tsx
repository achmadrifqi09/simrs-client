import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import React from "react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {patientValidationSchema} from "@/validation-schema/queue-register";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {usePost} from "@/hooks/use-post";
import {QueueInputPayload, RegisterResponse} from "@/types/queue-register";
import {capitalizeFirstLetter} from "@/utils/word-formatter";
import {formatToStandardDate} from "@/utils/date-formatter";
import {toast} from "@/hooks/use-toast";
import {Loader2} from "lucide-react";
import Link from "next/link";


type Patient = {
    kode_rm: string;
    nama_pasien: string;
    tempat_lahir: string;
    tgl_lahir: Date;
    jenis_kelamin: 1 | 2;
    id_warga_negara: number;
    identitas_pasien: number;
    no_identitas: string;
    no_bpjs: string;
    no_hp: string;
    id_ms_negara_tinggal: number;
    id_ms_provinsi_tinggal: string;
    id_ms_kota_tinggal: string;
    id_ms_kecamatan_tinggal: string;
    id_ms_desa_tinggal: string;
    alamat_tinggal: string;
    rt_tinggal: string;
    rw_tinggal: string;
    kode_pos_tinggal?: string | null;
    alamatgab_tinggal: string;
    suku?: string | null;
    nama_ibu_kandung?: string | null;
    id_ms_status_kawin?: number;
    id_ms_golongan_darah?: number;
    id_ms_agama: number;
    live?: number;
    rt_asal: string;
    rw_asal: string;
    id_ms_negara_asal: number;
    id_ms_propinsi_asal: string;
    id_ms_kota_asal: string;
    id_ms_kecamatan_asal: string;
    id_ms_desa_asal: string;
    alamat_asal: string;
    alamatgab_asal: string;
    nama_pekerjaan?: string | null;
    kode_pos_asal?: string | null;
    id_ms_pendidikan: number;
    created_by?: number;
    created_at?: Date;
    modified_at?: Date;
    modified_by?: number;
    deleted_at?: Date;
};

interface DetailPatientProps {
    data: Patient,
    scheduleId: number;
    patientType: number;
    handlePrintTicket: (data: RegisterResponse) => void;
    showDetail: boolean,
    setShowDetail: React.Dispatch<React.SetStateAction<boolean>>
}

const ConfirmationBookingOldPatient = ({
                                           data,
                                           showDetail,
                                           setShowDetail,
                                           scheduleId,
                                           patientType,
                                           handlePrintTicket,
                                       }: DetailPatientProps) => {
    const {postData, postLoading, postError} = usePost('/queue/old-patient', true)
    const patientForm = useForm<z.infer<typeof patientValidationSchema>>({
        resolver: zodResolver(patientValidationSchema),
        defaultValues: {
            nama_pasien: data.nama_pasien,
            no_hp: data.no_hp,
            tgl_lahir: data.tgl_lahir.toString().split('T')[0],
        }
    })

    const {handleSubmit, control} = patientForm

    const onSubmit = handleSubmit(async (values) => {
        if (![2, 4].includes(patientType)) {
            toast({
                description: "Jenis pasien tidak valid"
            });
        }
        const payload: QueueInputPayload = {
            nama_pasien: capitalizeFirstLetter(values.nama_pasien),
            jenis_pasien: 1,
            jenis_penjamin: Number(patientType) === 2 ? 2 : 1,
            id_jadwal_dokter: scheduleId,
            tgl_lahir: formatToStandardDate(values.tgl_lahir),
            no_hp: values.no_hp,
            no_bpjs: data.no_bpjs,
            kode_rm: data.kode_rm
        }
        const response = await postData(payload)
        if (response?.data) {
            handlePrintTicket(response.data)
            setShowDetail(false)
        }
    })

    return (
        <>
            <Dialog onOpenChange={setShowDetail} open={showDetail}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{postError ? 'Terjadi Kesalahan' : 'Identitas Anda'}</DialogTitle>
                        <DialogDescription>
                            <>
                                {
                                    !postError && (
                                        <p>
                                            *) Pastikan data anda sesuai, jika ada perubahan data silakan perbarui melalui
                                            formulir dibawah ini.
                                        </p>
                                    )
                                }
                            </>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {
                            postError ? (
                                <React.Fragment>
                                    <p className="text-sm text-gray-500">
                                        {
                                            postError && (
                                                <span> {postError.toString()}</span>
                                            )
                                        }
                                    </p>
                                    <div className="flex justify-end">
                                        <Button className="mt-4" asChild>
                                            <Link href="/ambil-antrean">
                                                Kembali
                                            </Link>
                                        </Button>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <Form {...patientForm}>
                                    <form onSubmit={onSubmit}>
                                        <div className="grid grid-cols-1 gap-4 items-start w-full">
                                            <FormField
                                                control={control}
                                                name="nama_pasien"
                                                render={({field}) => {
                                                    return (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nama Pasien*</FormLabel>
                                                            <FormControl>
                                                                <Input type="text" {...field}/>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )
                                                }}/>
                                            <FormField
                                                control={control}
                                                name="no_hp"
                                                render={({field}) => {
                                                    return (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Nomor HP*</FormLabel>
                                                            <FormControl className="relative">
                                                                <Input type="text" inputMode="numeric" {...field}/>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )
                                                }}/>
                                            <FormField
                                                control={control}
                                                name="tgl_lahir"
                                                render={({field}) => {
                                                    return (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Tanggal Lahir*</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" className="block" {...field}
                                                                       value={field.value.toString()}/>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )
                                                }}/>
                                        </div>
                                        <div className="flex justify-end mt-6">
                                            <Button type="submit" disabled={postLoading} className="min-w-[10em] mt-4">
                                                {
                                                    (postLoading) ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                            <span>Loading</span>
                                                        </>
                                                    ) : (
                                                        <span>Lanjutkan Mendaftar</span>
                                                    )
                                                }
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default ConfirmationBookingOldPatient;