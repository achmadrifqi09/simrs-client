"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import React, {useState} from "react";
import {usePost} from "@/hooks/use-post";
import {useForm} from "react-hook-form";
import {z, ZodError} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {religionSchema} from "@/validation-schema/demographic";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {Loader2} from "lucide-react";
import {NextAuthSession} from "@/types/session";
import ReligionTable from "@/app/(root)/demographic/religion/religion-table";
import type { Religion } from "@/types/religion";
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

const Religion = () => {
    const religionForm = useForm<z.infer<typeof religionSchema>>({
        resolver: zodResolver(religionSchema),
        defaultValues: {
            nama_agama: "",
            status: "1"
        }
    })
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const {data: session} = useSession() as { data: NextAuthSession };
    const [dialogTitle, setDialogTitle] = useState<string | null>("Tambah Data Agama");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const {postData, postLoading, postError} = usePost('/religion')
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const {handleSubmit, control, setValue} = religionForm
    const [deleteId, setDeleteId] = useState<number>()

    const handleOpenDialog = () => {
        setDialogTitle("Tambah Data Agama")
        setShowDialog((prev) => !prev)
    }

    const onUpdateReligion = (religion: Religion) => {
        setDialogTitle(`Update Agama ${religion.nama_agama}`)
        setShowDialog(true)
        setValue('nama_agama', religion.nama_agama)
        setValue('status', religion.status.toString())
    }

    const onDeleteReligion = (id: number) => {
        setDeleteId(id)
        setShowAlert(true)
    }

    const handleCloseDialog = () => {
        setValue('nama_agama', "")
        setValue('status', '1')
        setShowDialog(false)
    }

    const handleDelete = () => {
        console.log(deleteId)
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = await postData(
            {status: Number(values.status), nama_agama: values.nama_agama},
        );

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil menambahkan agama ${response.data.nama_agama}`,
            })
            religionForm.reset({
                nama_agama: "",
                status: "1"
            })
            setRefreshTrigger(prev => prev + 1);
        }
    });


    return (
        <>
            <Section>
                <Heading headingLevel="h5">Agama</Heading>
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
                        <DialogTitle>{dialogTitle}</DialogTitle>
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
                                {
                                    postError && Array.isArray(postError) && (
                                        <div>
                                            {postError.map((error: ZodError, index: number) => {
                                                return (
                                                    <p className="text-sm text-red-600" key={index}>{error.message}</p>
                                                )
                                            })}
                                        </div>
                                    )
                                }
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={postLoading}>
                                        {
                                            postLoading ? (
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
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Religion