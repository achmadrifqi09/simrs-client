import {useForm} from "react-hook-form";
import {z} from "zod";
import {oldPatientValidationSchema} from "@/validation-schema/queue-register";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {RegisterResponse} from "@/types/queue-register";
import {toast} from "@/hooks/use-toast";
import axios, {AxiosResponse} from "axios";
import {generateSignature} from "@/lib/crypto-js/cipher";
import {Loader2} from "lucide-react";
import ConfirmationBookingOldPatient
    from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/confirmation-booking-old-patient";
import AlertError from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/alert-error";

type OldPatientFormProps = {
    scheduleId: number;
    handlePrintTicket: (data: RegisterResponse) => void;
    patientType: number;
}

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

const OldPatientForm = ({scheduleId, handlePrintTicket, patientType}: OldPatientFormProps) => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Patient | null>(null)
    const [showDetail, setShowDetail] = useState<boolean>(false)
    const oldPatientForm = useForm<z.infer<typeof oldPatientValidationSchema>>({
        resolver: zodResolver(oldPatientValidationSchema),
        defaultValues: {
            identifier_number: "",
            patient_type: Number(patientType),
        }
    })
    const handleCloseDetail = () => {
        setShowDetail(false)
        setData(null)
    }
    const {handleSubmit, control} = oldPatientForm

    const onSubmit = handleSubmit(async (values) => {
        if (![2, 4].includes(patientType)) {
            toast({
                description: "Jenis pasien tidak valid"
            });
            return;
        }

        try {
            setLoading(true)
            const path = generateUrl(values.identifier_number, Number(values.patient_type))

            const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
                headers: {
                    'client-signature': generateSignature(),
                    'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                }
            })

            if (response?.status === 200 && response.data?.data) {
                oldPatientForm.clearErrors()
                setData(response.data?.data)
                setShowDetail(true)
            } else {
                setError('Data pasien tidak ditemukan')
                setData(null)
            }
        } catch (error: any) {
            setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
        } finally {
            setLoading(false)
        }
    });

    const generateUrl = (identifierNumber: string, patientType: number) => {
        if (patientType == 2 && identifierNumber.length == 13) {
            return `/patient/${identifierNumber}?identifier_type=2`;
        }
        if (identifierNumber.length == 7) return `/patient/${identifierNumber}?identifier_type=1`;
        if (identifierNumber.length == 16) return `/patient/${identifierNumber}?identifier_type=3`;
        oldPatientForm.setError('identifier_number', {
            type: 'validate',
            message: 'Nomor tidak valid'
        });
    }

    return (
        <>
            <Form {...oldPatientForm}>
                <form onSubmit={onSubmit}>
                    <FormField
                        control={control}
                        name="identifier_number"
                        render={({field}) => {
                            return (
                                <FormItem className="w-full">
                                    <FormLabel>{patientType === 2 ? 'Nomor BPJS/RM/NIK' : 'RM/NIK'}</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-4 items-center">
                                            <Input
                                                type="text" {...field}
                                                placeholder={patientType === 2 ? 'Masukkan Nomor BPJS/RM/NIK (pilih salah satu)' :
                                                    'Masukkan RM/NIK (pilih salah satu)'}
                                            />
                                            <Button type="submit" disabled={loading}>
                                                {
                                                    loading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                            <span>Loading</span>
                                                        </>
                                                    ) : (
                                                        <span>Cari</span>
                                                    )
                                                }
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>
                </form>
            </Form>
            {
                error && (
                    <AlertError message={error} isShow={true} redirectUrl="/ambil-antrean"/>
                )
            }
            {
                data && (
                    <ConfirmationBookingOldPatient
                        data={data}
                        setShowDetail={handleCloseDetail}
                        showDetail={showDetail}
                        patientType={patientType}
                        scheduleId={scheduleId}
                        handlePrintTicket={handlePrintTicket}
                    />

                )
            }
        </>
    )
}

export default OldPatientForm