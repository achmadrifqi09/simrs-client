"use client"

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {quotaValidation} from "@/validation-schema/doctor-schedule";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {dateFormatter} from "@/utils/date-formatter";
import {AdditionalQuota, DoctorSchedule} from "@/types/doctor-schedule";
import {usePost} from "@/hooks/use-post";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";

interface QuotaDialogProps {
    id: number | undefined,
    onRefresh: () => void,
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    currentDate: Date | undefined;
    actionType: Action;
}

const CreateAdditionalQuota = ({
                                   onRefresh,
                                   show,
                                   setShow,
                                   id,
                                   currentDate,
                                   actionType
                               }: QuotaDialogProps) => {
    const addQuotaForm = useForm<z.infer<typeof quotaValidation>>({
        resolver: zodResolver(quotaValidation),
        defaultValues: {
            kuota_mjkn: "0",
            kuota_online_umum: "0",
            kuota_onsite: "0",
        }
    })
    const {data: session} = useSession();
    const {control, handleSubmit, setValue} = addQuotaForm
    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);
    const {postData, postLoading, postError} = usePost(`/doctor-schedule/${id}/additional-quota`);

    const onUpdateAdditionalQuota = (addQuotaForm: DoctorSchedule | number) => {
        if (typeof addQuotaForm === 'number') {
            setSelectedRecordId(addQuotaForm);
        } else {
            setSelectedRecordId(addQuotaForm.id_jadwal_dokter);
            setValue('kuota_mjkn', addQuotaForm.kuota_mjkn.toString());
            setValue('kuota_online_umum', addQuotaForm.kuota_online_umum.toString());
            setValue('kuota_onsite', addQuotaForm.kuota_onsite.toString());
        }
    }
    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const payload: AdditionalQuota = {
            ...values,
            kuota_mjkn: Number(values.kuota_mjkn),
            kuota_online_umum: Number(values.kuota_online_umum),
            kuota_onsite: Number(values.kuota_onsite),
            tanggal_diterapkan: dateFormatter(currentDate)
        }
        const response = await postData(payload)
        if (response?.data) {
            setShow(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil menambah kuota tambahan`,
            })
            addQuotaForm.reset();
            onRefresh();
        }
    })
    useEffect(() => {
        if (id) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateAdditionalQuota(id);
        }
    }, [id, selectedRecordId])

    return (
        <>
            <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Tambah Kuota Pasien
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...addQuotaForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="kuota_mjkn"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kuota MJKN</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" inputMode="numeric" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                    <FormField
                                        control={control}
                                        name="kuota_online_umum"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kuota Online Umum</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" inputMode="numeric" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                    <FormField
                                        control={control}
                                        name="kuota_onsite"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kuota Onsite</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" inputMode="numeric" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <FormError
                                    errors={postError}
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={postLoading}>
                                        {
                                            (postLoading) ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    <span>Loading</span>
                                                </>
                                            ) : (
                                                <span>Simpan</span>
                                            )
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateAdditionalQuota
