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
import {villageValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {VillageDTO, DistrictDTO} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateVillageProps = {
    onRefresh: () => void,
    selectedRecord: VillageDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<VillageDTO | null>>
    actionType: Action
}

const UpdateOrCreateVillage = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType
                                }: UpdateOrCreateVillageProps) => {
    const villageForm = useForm<z.infer<typeof villageValidation>>({
        resolver: zodResolver(villageValidation),
        defaultValues: {
            nama: "",
            id_kecamatan: "",
            id: ""
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/village')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = villageForm

    const [selectedRecordId, setSelectedRecordId] = useState<string | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        villageForm.setValue('nama', "")
        villageForm.setValue('id_kecamatan', "")
        villageForm.setValue("id", "")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const onUpdateOrCreateVillage = (villageForm: VillageDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(villageForm.id.toString())
        setValue('nama', villageForm.nama)
        setValue('id_kecamatan', villageForm.id_kecamatan.toString())
        setValue('id', villageForm.id.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    id: values.id.toString(),
                    id_kecamatan: values.id_kecamatan,
                    nama: values.nama
                },
            )
        ) : (
            await updateData(
                `/master/village/${selectedRecordId}`,
                {
                    id: values.id.toString(),
                    id_kecamatan: values.id_kecamatan,
                    nama: values.nama
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} Desa ${response.data.nama}`,
            })
            villageForm.reset({
                nama: "",
                id_kecamatan: "",
                id: "",
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreateVillage(selectedRecord);
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        villageForm.clearErrors()
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Desa
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...villageForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_kecamatan"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Kecamatan</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<DistrictDTO>
                                                            url="/master/district"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan nama Kecamatan..."
                                                            onChange={field.onChange}
                                                            defaultValue={field.value}
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
                                                    <FormLabel>Nama Desa</FormLabel>
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

export default UpdateOrCreateVillage
