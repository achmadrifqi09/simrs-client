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
import {roomTypeValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {RoomClass, RoomType} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";
import {Permission} from "@/types/permission";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type UpdateOrCreatedRoomTypeProps = {
    onRefresh: () => void,
    selectedRecord: RoomType | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<RoomType | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreatedRoomType = ({
                                     onRefresh,
                                     selectedRecord,
                                     setSelectedRecord,
                                     actionType,
                                     permission
                                 }: UpdateOrCreatedRoomTypeProps) => {
    const roomTypeForm = useForm<z.infer<typeof roomTypeValidation>>({
        resolver: zodResolver(roomTypeValidation),
        defaultValues: {
            nama_jenis_kamar: "",
            id_kelas_kamar: 0,
            status: "1"
        }
    })
    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/room-type')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = roomTypeForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        roomTypeForm.setValue('nama_jenis_kamar', "")
        roomTypeForm.setValue('id_kelas_kamar', 0)
        roomTypeForm.setValue('status', "1")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/room-type/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate Status Jenis Kamar  ${selectedRecord?.nama_jenis_kamar} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateOrCreatedRoomType = (roomTypeForm: RoomType) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(roomTypeForm.id)
        setValue('nama_jenis_kamar', roomTypeForm.nama_jenis_kamar)
        setValue('id_kelas_kamar', roomTypeForm?.kelas_kamar?.id ?? 0);
        setValue('status', roomTypeForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    status: Number(values.status),
                    id_kelas_kamar: Number(values.id_kelas_kamar.toString()),
                    nama_jenis_kamar: values.nama_jenis_kamar,
                },
            )
        ) : (
            await updateData(
                `/master/room-type/${selectedRecordId}`,
                {
                    status: Number(values.status),
                    id_kelas_kamar: Number(values.id_kelas_kamar.toString()),
                    nama_jenis_kamar: values.nama_jenis_kamar
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} provinsi ${response.data.nama_jenis_kamar}`,
            })
            roomTypeForm.reset({
                nama_jenis_kamar: "",
                id_kelas_kamar: 0,
                status: "1"
            })
            onRefresh();
        }
    });
    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreatedRoomType(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        roomTypeForm.clearErrors()
    }, [showDialog]);

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    {
                        permission?.can_create && (
                            <Button className="mb-4"
                                    onClick={handleOpenDialog}>Tambah</Button>
                        )
                    }
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Jenis Kamar
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...roomTypeForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_kelas_kamar"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Kelas kamar</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<RoomClass>
                                                            url="/master/room-class?status=1"
                                                            labelName="nama_kelas_kamar"
                                                            valueName="id"
                                                            placeholder="Masukkan kelas kamar untuk mencari..."
                                                            onChange={field.onChange}
                                                            defaultValue={Number(field.value) || undefined}
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
                                        name="nama_jenis_kamar"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Jenis Kamar</FormLabel>
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

export default UpdateOrCreatedRoomType
