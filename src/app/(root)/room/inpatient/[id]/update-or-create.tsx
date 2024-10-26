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
import {bedValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {Bed} from "@/types/master";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";

type UpdateOrCreatedRoomProps = {
    onRefresh: () => void,
    selectedRecord: Bed | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<Bed | null>>
    actionType: Action,
    permission: Permission | null,
    id_params: string
}

const UpdateOrCreatedRoom = ({
                                 onRefresh,
                                 selectedRecord,
                                 setSelectedRecord,
                                 actionType,
                                 permission,
                                 id_params
                             }: UpdateOrCreatedRoomProps) => {
    const bedForm = useForm<z.infer<typeof bedValidation>>({
        resolver: zodResolver(bedValidation),
        defaultValues: {
            nama_bed: "",
            id_ms_kamar: Number(id_params) || 0,
            keterangan: "",
            status_bed: '0',
            status: "1"
        }
    })
    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');
    const {postData, postLoading, postError, setPostError} = usePost('/master/bed')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = bedForm
    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) {
                onUpdateOrCreatedRoom(selectedRecord);
            }
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status);
            }
        }
    }, [selectedRecord, actionType]);

    useEffect(() => {
        if (showDialog !== undefined) {
            setPostError(null);
            setPatchError(null);
            bedForm.clearErrors();
        }
    }, [showDialog]);


    useEffect(() => {
        if (id_params) {
            bedForm.setValue('id_ms_kamar', Number(id_params));
        }
    }, [id_params]);


    const handleOpenDialog = () => {
        if (id_params) {
            setValue('id_ms_kamar', Number(id_params));
        }
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        bedForm.reset({
            nama_bed: "",
            id_ms_kamar: Number(id_params) || 0,
            keterangan: "",
            status_bed: '0',
            status: "1"
        });
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/bed/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate Status Kasur  ${selectedRecord?.nama_bed} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateOrCreatedRoom = (bedForm: Bed) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(bedForm.id)
        setValue('nama_bed', bedForm.nama_bed);
        setValue('id_ms_kamar', bedForm.id_ms_kamar?.id || 0);
        setValue('keterangan', bedForm.keterangan);
        setValue('status_bed', bedForm.status_bed.toString());
        setValue('status', bedForm.status.toString());
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    status: Number(values.status),
                    id_ms_kamar: Number(id_params),
                    nama_bed: values.nama_bed,
                    keterangan: values.keterangan,
                    status_bed: Number(values.status_bed)
                },
            )
        ) : (
            await updateData(
                `/master/bed/${selectedRecordId}`,
                {
                    status: Number(values.status),
                    id_ms_kamar: Number(id_params),
                    nama_bed: values.nama_bed,
                    keterangan: values.keterangan,
                    status_bed: Number(values.status_bed)
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} kasur ${response.data.nama_bed}`,
            })
            bedForm.reset({
                nama_bed: "",
                id_ms_kamar: 0,
                keterangan: "",
                status_bed: '0',
                status: "1"
            })
            onRefresh();
        }
    });

    const router = useRouter();

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <div className="flex gap-4 mb-2">
                    <DialogTrigger asChild>
                        {
                            permission?.can_create && (
                                <Button className="mb-4"
                                        onClick={handleOpenDialog}>Tambah Bed</Button>
                            )
                        }
                    </DialogTrigger>
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Kembali
                    </Button>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data kamar
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...bedForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_bed"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Kasur</FormLabel>
                                                    <FormControl>
                                                        <Input type="text"
                                                               defaultValue="nama_bed"
                                                               {...field}/>
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
                                                        <Input type="text"
                                                               defaultValue="nama_bed"
                                                               {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="status_bed"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Status Kasur</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status kamar .."/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="0">Siap Digunakan</SelectItem>
                                                                <SelectItem value="1">Digunakan</SelectItem>
                                                                <SelectItem value="2">Dibersihkan</SelectItem>
                                                                <SelectItem value="3">Rusak</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
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

export default UpdateOrCreatedRoom
