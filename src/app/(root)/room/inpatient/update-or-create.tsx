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
import {roomValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {Building, Room, RoomType} from "@/types/master";
import {Action} from "@/enums/action";
import SelectSearch from "@/components/ui/select-search";
import {Permission} from "@/types/permission";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type UpdateOrCreatedRoomProps = {
    onRefresh: () => void,
    selectedRecord: Room | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<Room | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreatedRoom = ({
                                 onRefresh,
                                 selectedRecord,
                                 setSelectedRecord,
                                 actionType,
                                 permission
                             }: UpdateOrCreatedRoomProps) => {
    const roomForm = useForm<z.infer<typeof roomValidation>>({
        resolver: zodResolver(roomValidation),
        defaultValues: {
            nama_kamar: "",
            id_ms_kamar_jenis: 0,
            lantai: 0,
            id_gedung: 0,
            status: "1"
        }
    })
    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError, setPostError} = usePost('/master/room')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = roomForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        roomForm.setValue('nama_kamar', "")
        roomForm.setValue('id_ms_kamar_jenis', 0)
        roomForm.setValue('lantai', 0)
        roomForm.setValue('id_gedung', 0)
        roomForm.setValue('status', "1")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/room/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate Status Kamar  ${selectedRecord?.nama_kamar} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateOrCreatedRoom = (roomForm: Room) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(roomForm.id)
        setValue('nama_kamar', roomForm.nama_kamar || '')
        setValue('id_ms_kamar_jenis', roomForm.jenis_kamar?.id || 0)
        setValue('lantai', roomForm.lantai)
        setValue('id_gedung', roomForm.gedung?.id || 0)
        setValue('status', roomForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    status: Number(values.status),
                    id_ms_kamar_jenis: Number(values.id_ms_kamar_jenis.toString()),
                    nama_kamar: values.nama_kamar,
                    id_gedung: values.id_gedung,
                    lantai: values.lantai
                },
            )
        ) : (
            await updateData(
                `/master/room/${selectedRecordId}`,
                {
                    status: Number(values.status),
                    id_ms_kamar_jenis: Number(values.id_ms_kamar_jenis.toString()),
                    nama_kamar: values.nama_kamar,
                    id_gedung: values.id_gedung,
                    lantai: values.lantai
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} kasur ${response.data.nama_kamar}`,
            })
            roomForm.reset({
                nama_kamar: "",
                id_ms_kamar_jenis: 0,
                status: "1"
            })
            onRefresh();
        }
    });
    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateOrCreatedRoom(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        roomForm.clearErrors()
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data kamar
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...roomForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_gedung"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Gedung</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<Building>
                                                            url="/master/building?status=1"
                                                            labelName="nama_gedung"
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
                                        name="id_ms_kamar_jenis"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Jenis kamar</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<RoomType>
                                                            url="/master/room-type?status=1"
                                                            labelName="nama_jenis_kamar"
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
                                        name="nama_kamar"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Kamar</FormLabel>
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
                                        name="lantai"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Lantai</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field}/>
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

export default UpdateOrCreatedRoom
