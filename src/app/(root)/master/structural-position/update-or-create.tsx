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
import {structuralPositionValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {StructuralPosition} from "@/types/master";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";

type UpdateOrCreateStructuralPositionProps = {
    onRefresh: () => void,
    selectedRecord: StructuralPosition | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<StructuralPosition | null>>
    actionType: Action
    permission: Permission | null
}

const UpdateOrCreateStructuralPosition = ({
                                              onRefresh,
                                              selectedRecord,
                                              setSelectedRecord,
                                              actionType,
                                              permission
                                          }: UpdateOrCreateStructuralPositionProps) => {
    const structuralPositionForm = useForm<z.infer<typeof structuralPositionValidation>>({
        resolver: zodResolver(structuralPositionValidation),
        defaultValues: {
            nama_jabatan: "",
            status: "1"
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/structural-position')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = structuralPositionForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('nama_jabatan', "")
        setValue('status', '1')
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/structural-position/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status jabatan  ${selectedRecord?.nama_jabatan} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateStructuralPosition = (structuralPositionForm: StructuralPosition) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(structuralPositionForm.id_ms_jabatan)
        setValue('nama_jabatan', structuralPositionForm.nama_jabatan)
        setValue('status', structuralPositionForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {status: Number(values.status), nama_jabatan: values.nama_jabatan},
            )
        ) : (
            await updateData(
                `/master/structural-position/${selectedRecordId}`,
                {status: Number(values.status), nama_jabatan: values.nama_jabatan},
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} jabatan ${response.data.nama_jabatan}`,
            })
            structuralPositionForm.reset({
                nama_jabatan: "",
                status: "1"
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateStructuralPosition(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id_ms_jabatan, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    {
                        permission?.can_create && (
                            <Button className="mb-4" onClick={handleOpenDialog}>Tambah</Button>
                        )
                    }
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Jabatan Struktural
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...structuralPositionForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_jabatan"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Jabatan</FormLabel>
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

export default UpdateOrCreateStructuralPosition
