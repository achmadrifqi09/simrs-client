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
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {regencyValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {Province, Regency} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateRegencyProps = {
    onRefresh: () => void,
    selectedRecord: Regency | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<Regency | null>>
    actionType: Action
}

const UpdateOrCreateRegency = ({
                                   onRefresh,
                                   selectedRecord,
                                   setSelectedRecord,
                                   actionType
                               }: UpdateOrCreateRegencyProps) => {
    const regencyForm = useForm<z.infer<typeof regencyValidation>>({
        resolver: zodResolver(regencyValidation),
        defaultValues: {
            nama: "",
            id_provinsi: "",
            id: ""
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/regency')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = regencyForm

    const [selectedRecordId, setSelectedRecordId] = useState<string | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        regencyForm.setValue('nama', "")
        regencyForm.setValue('id_provinsi', "")
        regencyForm.setValue("id", "")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const onUpdateOrCreateRegency = (regencyForm: Regency) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(regencyForm.id.toString())
        setValue('nama', regencyForm.nama)
        setValue('id_provinsi', regencyForm.id_provinsi.toString())
        setValue('id', regencyForm.id.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        console.log(values)
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    id: values.id.toString(),
                    id_provinsi: values.id_provinsi,
                    nama: values.nama
                },
            )
        ) : (
            await updateData(
                `/master/regency/${selectedRecordId}`,
                {
                    id: values.id.toString(),
                    id_provinsi: values.id_provinsi,
                    nama: values.nama
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} Kabupaten / Kota ${response.data.nama}`,
            })
            regencyForm.reset({
                nama: "",
                id_provinsi: "",
                id: "",
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreateRegency(selectedRecord);
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        regencyForm.clearErrors()
    }, [showDialog]);
    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    <Button className="mb-4" onClick={handleOpenDialog}>Tambah Data</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Kabupaten / Kota
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...regencyForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_provinsi"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Provinsi</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<Province>
                                                            url="/master/province"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan nama Provinsi untuk mencari..."
                                                            onChange={field.onChange}
                                                            defaultValue={field.value || undefined}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kode Wilayah</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" inputMode="numeric" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Kabupaten / Kota</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field}/>
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

export default UpdateOrCreateRegency
