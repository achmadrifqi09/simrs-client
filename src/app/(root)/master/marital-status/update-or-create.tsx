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
import {maritalStatusValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {NextAuthSession} from "@/types/session";
import type {MaritalStatusDTO} from "@/types/master";
import {Action} from "@/enums/action";

type UpdateOrCreateMaritalStatusProps = {
    onRefresh: () => void,
    selectedRecord: MaritalStatusDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<MaritalStatusDTO | null>>
    actionType: Action
}

const UpdateOrCreateMaritalStatus = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType
                                }: UpdateOrCreateMaritalStatusProps) => {
    const maritalStatusForm = useForm<z.infer<typeof maritalStatusValidation>>({
        resolver: zodResolver(maritalStatusValidation),
        defaultValues: {
            nama_status_kawin: "",
            status: "1"
        }
    })

    const {data: session} = useSession() as { data: NextAuthSession };
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/marital-status')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = maritalStatusForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('nama_status_kawin', "")
        setValue('status', '1')
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/marital-status/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate visibilitas  ${selectedRecord?.nama_status_kawin} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateMaritalStatus = (maritalStatusForm: MaritalStatusDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(maritalStatusForm.id_ms_status_kawin)
        setValue('nama_status_kawin', maritalStatusForm.nama_status_kawin)
        setValue('status', maritalStatusForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {status: Number(values.status), nama_status_kawin: values.nama_status_kawin},
            )
        ) : (
            await updateData(
                `/master/marital-status/${selectedRecordId}`,
                {status: Number(values.status), nama_status_kawin: values.nama_status_kawin},
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} status kawin ${response.data.nama_status_kawin}`,
            })
            maritalStatusForm.reset({
                nama_status_kawin: "",
                status: "1"
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateMaritalStatus(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id_ms_status_kawin, selectedRecord.status)
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Status Kawin
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...maritalStatusForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_status_kawin"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Status Perkawinan</FormLabel>
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
                                        name="status"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
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

export default UpdateOrCreateMaritalStatus