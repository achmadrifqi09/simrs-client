"use client"
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {rePrintValidation} from "@/validation-schema/queue-register";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import axios, {AxiosResponse} from "axios";
import {generateSignature} from "@/lib/crypto-js/cipher";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/navigation";
import {RegisterResponse} from "@/types/queue-register";
import {useReactToPrint} from "react-to-print";
import QueueTicket from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/ticket";

const ReprintTicket = () => {
    const [show, setShow] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const rePrintForm = useForm<z.infer<typeof rePrintValidation>>({
        resolver: zodResolver(rePrintValidation),
        defaultValues: {
            identifier_code: "",
            identifier_type: "",
        }
    })
    const router = useRouter()
    const [queueResult, setQueueResult] = useState<RegisterResponse | null>(null)
    const contentRef = useRef<HTMLDivElement>(null);
    const {handleSubmit, control} = rePrintForm

    const onSubmit = handleSubmit(async (values) => {
        const response: AxiosResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/queue/${values.identifier_code}?identifier_type=${values.identifier_type}`,
            {
                headers: {
                    'client-signature': generateSignature(),
                    'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                }
            })
        if (response?.status === 200 && response.data?.data) {
            rePrintForm.clearErrors()
            setQueueResult(response.data?.data)
        } else {
            setError('Data pasien tidak ditemukan')
            setShow(true)
            setQueueResult(null)
        }
    })

    const handleActionError = () => {
        setError(null)
        setShow(false)
    }

    const handleBackButton = () => {
        if (history) history.back()
    }

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        onAfterPrint: () => {
            router.push('/ambil-antrean')
        }
    });

    useEffect(() => {
        if (queueResult && contentRef.current) {
            reactToPrintFn();
        }
    }, [queueResult]);

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                    Kembali
                </Button>
                <div>
                    <Heading headingLevel="h4" variant="section-title" className="text-center mb-1">
                        Cetak Ulang Tiket Antrean</Heading>
                </div>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto mt-4">
                <div className="mt-10">
                    <p className="italic text-gray-500"><span className="text-primary">**</span>
                        Pastikan anda telah mengambil antrean dihari ini
                    </p>
                    <Form {...rePrintForm}>
                        <form onSubmit={onSubmit} className="flex w-full items-start gap-6">
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="identifier_type"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Jenis nomor*</FormLabel>
                                                <FormControl className="relative">
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Pilih jenis nomor"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Kode RM</SelectItem>
                                                            <SelectItem value="2">BPJS</SelectItem>
                                                            <SelectItem value="3">No Rujukan</SelectItem>
                                                            <SelectItem value="4">No Hp</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4 w-full">
                                <FormField
                                    control={control}
                                    name="identifier_code"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Nomor*</FormLabel>
                                                <FormControl className="relative">
                                                    <div className="flex items-center gap-4">
                                                        <Input
                                                            type="number"
                                                            placeholder="Masukkan nomor" {...field}/>
                                                        <Button variant="outline" type="submit">Cari</Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <AlertDialog open={show} onOpenChange={handleActionError}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terjadi Kesalahan</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            {error}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleActionError}>Oke</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {
                queueResult && (
                    <div className="fixed left-[100vw]">
                        <QueueTicket data={queueResult} ref={contentRef}/>
                    </div>
                )
            }
        </div>
    )
}

export default ReprintTicket