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
import {districtValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {DistrictDTO, RegencyDTO} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateDistrictProps = {
    onRefresh: () => void,
    selectedRecord: DistrictDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<DistrictDTO | null>>
    actionType: Action
}

const UpdateOrCreateDistrict = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType
                                }: UpdateOrCreateDistrictProps) => {
    const districtForm = useForm<z.infer<typeof districtValidation>>({
        resolver: zodResolver(districtValidation),
        defaultValues: {
            nama: "",
            id_kabkot: "",
            id: ""
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/district')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = districtForm

    const [selectedRecordId, setSelectedRecordId] = useState<string | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        districtForm.setValue('nama', "")
        districtForm.setValue('id_kabkot', "")
        districtForm.setValue("id", "")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const onUpdateOrCreateDistrict = (districtForm: DistrictDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(districtForm.id.toString())
        setValue('nama', districtForm.nama)
        setValue('id_kabkot', districtForm.id_kabkot.toString())
        setValue('id', districtForm.id.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    id: values.id.toString(),
                    id_kabkot: values.id_kabkot,
                    nama: values.nama
                },
            )
        ) : (
            await updateData(
                `/master/district/${selectedRecordId}`,
                {
                    id: values.id.toString(),
                    id_kabkot: values.id_kabkot,
                    nama: values.nama
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} kecamatan ${response.data.nama}`,
            })
            districtForm.reset({
                nama: "",
                id_kabkot: "",
                id: "",
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreateDistrict(selectedRecord);
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        districtForm.clearErrors()
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Kecamatan
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...districtForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_kabkot"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Kabupaten / Kota</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<RegencyDTO>
                                                            url="/master/regency"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan nama Kota..."
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
                                                    <FormLabel>Nama Kecamatan</FormLabel>
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

export default UpdateOrCreateDistrict
