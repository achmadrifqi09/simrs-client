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
import {roomClassValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {RoomClassDTO} from "@/types/master";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";

type RankOrClassProps = {
    onRefresh: () => void,
    selectedRecord: RoomClassDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<RoomClassDTO | null>>
    actionType: Action
    permission: Permission | null
}

const UpdateOrCreateCountry = ({
                                   onRefresh,
                                   selectedRecord,
                                   setSelectedRecord,
                                   actionType,
                                   permission
                               }: RankOrClassProps) => {
    const roomClassForm = useForm<z.infer<typeof roomClassValidation>>({
        resolver: zodResolver(roomClassValidation),
        defaultValues: {
            nama_kelas_kamar: "",
            status: "1",
            kode_bpjs_kamar: ""
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/room-class')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = roomClassForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('nama_kelas_kamar', "")
        setValue('status', '1')
        setValue('kode_bpjs_kamar', "")
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/room-class/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status kelas kamar ${selectedRecord?.nama_kelas_kamar} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateRankOrClass = (roomClassForm: RoomClassDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(roomClassForm.id)
        setValue('nama_kelas_kamar', roomClassForm.nama_kelas_kamar)
        setValue('status', roomClassForm.status.toString())
        setValue('kode_bpjs_kamar', roomClassForm.kode_bpjs_kamar)
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const payload = {
            status: Number(values.status),
            nama_kelas_kamar: values.nama_kelas_kamar,
            kode_bpjs_kamar: values.kode_bpjs_kamar,
        };

        const response = submitMode === 'POST' ? (
            await postData(payload)
        ) : (
            await updateData(`/master/room-class/${selectedRecordId}`, payload)
        );

        if (response?.data) {
            setShowDialog(false);
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data' : 'memperbarui data'} Kelas Kamar ${response.data.nama_kelas_kamar}`,
            });
            roomClassForm.reset({
                nama_kelas_kamar: "",
                status: "1",
                kode_bpjs_kamar: ""
            });
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateRankOrClass(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status)
            }
        }
    }, [selectedRecord])
    console.log(roomClassForm.getValues())
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Kelas Kamar
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...roomClassForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_kelas_kamar"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Kelas Kamar</FormLabel>
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
                                        name="kode_bpjs_kamar"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kode BPJS kamar</FormLabel>
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

export default UpdateOrCreateCountry
