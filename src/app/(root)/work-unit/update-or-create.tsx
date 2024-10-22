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
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {fieldOfWorkUnitValidation } from "@/validation-schema/work-unit";
import {FieldOfWorkUnit} from "@/types/work-unit";
import {Loader2} from "lucide-react";

type UpdateOrCreateFieldWorkUnitProps = {
    onRefresh: () => void,
    selectedRecord: FieldOfWorkUnit | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<FieldOfWorkUnit | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreateFieldWorkUnit = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType,
                                    permission
                                }: UpdateOrCreateFieldWorkUnitProps) => {
    const workUnitForm = useForm<z.infer<typeof fieldOfWorkUnitValidation>>({
        resolver: zodResolver(fieldOfWorkUnitValidation),
        defaultValues: {
            nama_bidang: "",
            status: "1",
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');
    const {postData, postLoading, postError} = usePost('/field-of-work-unit')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = workUnitForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        workUnitForm.reset();
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/field-of-work-unit/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status unit kerja ${selectedRecord?.nama_bidang} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateBloodType = (fieldOfWorkUnit: FieldOfWorkUnit) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(fieldOfWorkUnit.id)
        setValue('nama_bidang', fieldOfWorkUnit.nama_bidang)
        setValue('status', fieldOfWorkUnit.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const submitData: FieldOfWorkUnit = {
            nama_bidang: values.nama_bidang,
            status: Number(values.status),
        }
        const response = submitMode === 'POST' ? (
            await postData(submitData)
        ) : (
            await updateData(
                `/field-of-work-unit/${selectedRecordId}`,
                submitData
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} bidang unit kerja ${response.data.nama_golongan_darah}`,
            })
            workUnitForm.reset();
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateBloodType(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    {
                        (permission?.can_create) && (

                            <Button className="mb-4" onClick={handleOpenDialog}>Tambah Bidang</Button>
                        )
                    }
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] w-full">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Bidang Unit Kerja
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...workUnitForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_bidang"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama bidang</FormLabel>
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
                                                                <SelectValue
                                                                    placeholder="Pilih status"/>
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

export default UpdateOrCreateFieldWorkUnit
