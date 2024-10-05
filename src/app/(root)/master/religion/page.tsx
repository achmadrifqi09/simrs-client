"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {religionSchema} from "@/validation-schema/demographic";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {Loader2} from "lucide-react";
import {NextAuthSession} from "@/types/session";
import ReligionTable from "@/app/(root)/master/religion/religion-table";
import type {Religion} from "@/types/religion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {usePatch} from "@/hooks/use-patch";
import FormError from "@/components/ui/form-error";
import {useDelete} from "@/hooks/use-delete";

const Page = () => {
    const religionForm = useForm<z.infer<typeof religionSchema>>({
        resolver: zodResolver(religionSchema),
        defaultValues: {
            nama_agama: "",
            status: "1"
        }
    })
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const {data: session} = useSession() as { data: NextAuthSession };
    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const {handleSubmit, control, setValue} = religionForm

    const {postData, postLoading, postError} = usePost('/religion')
    const {updateData, patchError, patchLoading} = usePatch()
    const {deleteData, deleteError, deleteLoading} = useDelete()

    const handleOpenDialog = () => {
        setSubmitMode('POST')
        setShowDialog((prev) => !prev)
    }

    const onUpdateReligion = (religion: Religion) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(religion.id_ms_agama)
        setValue('nama_agama', religion.nama_agama)
        setValue('status', religion.status.toString())
    }

    const onDeleteReligion = (id: number) => {
        setSelectedRecordId(id)
        setShowAlert(true)
    }

    const handleCloseDialog = () => {
        setValue('nama_agama', "")
        setValue('status', '1')
        setShowDialog(false)
    }

    const handleDelete = async () => {
        const result = await deleteData(`/religion/${selectedRecordId}`)

        if (result?.status_code === 200) {
            toast({
                title: 'Delete Berhasil',
                description: 'Berhasil manghapus data terkait',
            })
            setRefreshTrigger(prev => prev + 1);
        }
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.apiToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {status: Number(values.status), nama_agama: values.nama_agama},
            )
        ) : (
            await updateData(
                `/religion/${selectedRecordId}`,
                {status: Number(values.status), nama_agama: values.nama_agama},
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'update data '} agama ${response.data.nama_agama}`,
            })
            religionForm.reset({
                nama_agama: "",
                status: "1"
            })
            setRefreshTrigger(prev => prev + 1);
        }
    });

    useEffect(() => {
        if (deleteError) {
            toast({
                title: 'Terjadi Kesalahan',
                description: deleteError?.toString(),
            })
            console.log(deleteError)
        }
    }, [deleteError]);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Agama</Heading>
            <Section>
                <div className="space-y-6">
                    <Button onClick={handleOpenDialog}>Tambah Data</Button>
                    <ReligionTable
                        refreshTrigger={refreshTrigger}
                        onUpdateReligion={onUpdateReligion}
                        onDeleteReligion={onDeleteReligion}
                    />
                </div>
            </Section>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{submitMode === 'POST' ? 'Tambah ' : 'Update '}Data Master Agama</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...religionForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_agama"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Agama</FormLabel>
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
                                                                <SelectValue placeholder="Pilih jenis pasien"/>
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
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogTrigger asChild>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Peringatan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah anda yakin akan menghapus data ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {
                                (deleteLoading) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <span>Lanjutkan</span>
                                )
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Page