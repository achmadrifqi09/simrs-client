"use client"
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
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {Action} from "@/enums/action";
import {counterValidation} from "@/validation-schema/counter";
import {Permission} from "@/types/permission";
import {Textarea} from "@/components/ui/textarea";

type CounterDTO = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    status: number;
    keterangan: string | undefined;
    jenis_loket: number;
}

type UpdateOrCreateCounterProps = {
    onRefresh: () => void,
    selectedRecord: CounterDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<CounterDTO | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreateCounter = ({
                                   onRefresh,
                                   selectedRecord,
                                   setSelectedRecord,
                                   actionType
                               }: UpdateOrCreateCounterProps) => {
    const counterForm = useForm<z.infer<typeof counterValidation>>({
        resolver: zodResolver(counterValidation),
        defaultValues: {
            nama_loket: "",
            status: "1",
            jenis_loket: "1",
            keterangan: "",
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/counter')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = counterForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        counterForm.reset()
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/counter/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status ${selectedRecord?.nama_loket} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateCounter = (counterForm: CounterDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(counterForm.id_ms_loket_antrian)
        setValue('nama_loket', counterForm.nama_loket)
        setValue("keterangan", counterForm.keterangan || "")
        setValue("jenis_loket", counterForm.jenis_loket.toString())
        setValue('status', counterForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {
                    nama_loket: values.nama_loket,
                    status: Number(values.status),
                    jenis_loket: Number(values.jenis_loket),
                    keterangan: values.keterangan || "",
                }
            )
        ) : (
            await updateData(
                `/master/counter/${selectedRecordId}`,
                {
                    nama_loket: values.nama_loket,
                    status: Number(values.status),
                    jenis_loket: Number(values.jenis_loket),
                    keterangan: values.keterangan || "",
                }
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} loket ${response.data.nama_loket}`,
            })
            counterForm.reset()
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateCounter(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id_ms_loket_antrian, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    <Button className="mb-4" onClick={handleOpenDialog}>Tambah</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Loket
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...counterForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_loket"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Loket</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="jenis_loket"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Jenis Loket</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value.toString() || "1"}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih jenis loket"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="1">
                                                                        Loket Admisi
                                                                    </SelectItem>
                                                                    <SelectItem value="2">
                                                                        Loket Farmasi
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value.toString() || "1"}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih status / visibilitas"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="1">
                                                                        Aktif
                                                                    </SelectItem>
                                                                    <SelectItem value="0">
                                                                        Non Aktif
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="keterangan"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Keterangan</FormLabel>
                                                    <FormControl>
                                                        <Textarea onChange={field.onChange} value={field?.value || ""}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <FormError
                                    errors={postError || patchError}
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={postLoading}>
                                        {
                                            (postLoading || patchLoading) ? (
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
        </div>
    )
}

export default UpdateOrCreateCounter
