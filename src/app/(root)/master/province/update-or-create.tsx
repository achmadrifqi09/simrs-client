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
import {provinceValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {CountryDTO, ProvinceDTO} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateProvinceProps = {
    onRefresh: () => void,
    selectedRecord: ProvinceDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<ProvinceDTO | null>>
    actionType: Action
}

const UpdateOrCreateProvince = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType
                                }: UpdateOrCreateProvinceProps) => {
    const provinceForm = useForm<z.infer<typeof provinceValidation>>({
        resolver: zodResolver(provinceValidation),
        defaultValues: {
            nama: "",
            id_negara: 0,
            id: ""
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/province')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = provinceForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        provinceForm.setValue('nama', "")
        provinceForm.setValue('id_negara', 0)
        provinceForm.setValue("id", "")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/province/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate visibilitas  ${selectedRecord?.nama} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateOrCreateProvince = (provinceForm: ProvinceDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(provinceForm.id)
        setValue('nama', provinceForm.nama)
        setValue('id_negara', provinceForm.id_negara)
        setValue('id', provinceForm.id.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {
                    id: values.id.toString(),
                    id_negara: Number(values.id_negara),
                    nama: values.nama
                },
            )
        ) : (
            await updateData(
                `/master/province/${selectedRecordId}`,
                {
                    id: values.id.toString(),
                    id_negara: Number(values.id_negara),
                    nama: values.nama
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} provinsi ${response.data.nama}`,
            })
            provinceForm.reset({
                nama: "",
                id_negara: 0,
                id: "",
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreateProvince(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.id_negara)
            }
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        provinceForm.clearErrors()
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Provinsi
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...provinceForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_negara"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Negara</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<CountryDTO>
                                                            url="/master/country"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan nama negara untuk mencari..."
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
                                                    <FormLabel>Nama Provinsi</FormLabel>
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

export default UpdateOrCreateProvince
