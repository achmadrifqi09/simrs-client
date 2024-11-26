import {useForm} from "react-hook-form";
import {z} from "zod";
import {patientValidationSchema} from "@/validation-schema/queue-register";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {QueueInputPayload, RegisterResponse} from "@/types/queue-register";
import {formatToStandardDate} from "@/utils/date-formatter";
import {capitalizeFirstLetter} from "@/utils/word-formatter";
import {usePost} from "@/hooks/use-post";
import {Loader2} from "lucide-react";
import AlertError from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/alert-error";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

interface NewPatientFormProps {
    scheduleId: number;
    handlePrintTicket: (data: RegisterResponse) => void;
    patientType: number;
}

export default function NewPatientForm({scheduleId, handlePrintTicket, patientType}: NewPatientFormProps) {
    const router = useRouter()
    const {postData, postLoading, postError} = usePost('/queue/new-patient', true)
    const newPatientForm = useForm<z.infer<typeof patientValidationSchema>>({
        resolver: zodResolver(patientValidationSchema),
        defaultValues: {
            nama_pasien: "",
            no_hp: "",
            tgl_lahir: ""
        }
    })

    const {handleSubmit, control} = newPatientForm

    const onSubmit = handleSubmit(async (values) => {
        if (![1, 3].includes(patientType)) {
            toast({
                description: "Jenis pasien tidak valid"
            });
            router.back();
        }

        const payload: QueueInputPayload = {
            nama_pasien: capitalizeFirstLetter(values.nama_pasien),
            jenis_pasien: 2,
            jenis_penjamin: Number(patientType) === 1 ? 2 : 1,
            id_jadwal_dokter: scheduleId,
            tgl_lahir: formatToStandardDate(values.tgl_lahir),
            no_hp: values.no_hp
        }

        const response = await postData(payload)
        if (response?.data) {
            handlePrintTicket(response.data)
        }
    })

    return (
        <>
            <Form {...newPatientForm}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <FormField
                            control={control}
                            name="nama_pasien"
                            render={({field}) => {
                                return (
                                    <FormItem>
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
                                    <FormItem>
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
                                    <FormItem>
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
                    <div className="flex justify-end mt-8">
                        <Button type="submit" disabled={postLoading} className="min-w-[10em] mt-4">
                            {
                                (postLoading) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <span>Daftar</span>
                                )
                            }
                        </Button>
                    </div>
                </form>
            </Form>
            {
                postError && (
                    <AlertError message={postError} isShow={true} redirectUrl="/ambil-antrean"/>
                )
            }
        </>
    )
}
