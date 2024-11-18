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
import {employeeCategoryValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {EmployeeCategory} from "@/types/master";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";

type UpdateOrCreateEmployeeCategoryProps = {
    onRefresh: () => void,
    selectedRecord: EmployeeCategory | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<EmployeeCategory | null>>
    actionType: Action
    permission: Permission | null
}

const UpdateOrCreateEmployeeCategory = ({
                                            onRefresh,
                                            selectedRecord,
                                            setSelectedRecord,
                                            actionType,
                                            permission
                                        }: UpdateOrCreateEmployeeCategoryProps) => {
    const employeeTypeForm = useForm<z.infer<typeof employeeCategoryValidation>>({
        resolver: zodResolver(employeeCategoryValidation),
        defaultValues: {
            status_jenis_pegawai: "",
            status: "1",
            kode_nip: 0
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/employee-category')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = employeeTypeForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('status_jenis_pegawai', "")
        setValue('status', '1')
        setValue('kode_nip', 0)
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/employee-category/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate kategori Pegawai ${selectedRecord?.status_jenis_pegawai} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateEmployeeType = (employeeTypeForm: EmployeeCategory) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(employeeTypeForm.id_ms_jenis_pegawai_status)
        setValue('status_jenis_pegawai', employeeTypeForm.status_jenis_pegawai.toString())
        setValue('status', employeeTypeForm.status.toString())
        setValue('kode_nip', Number(employeeTypeForm.kode_nip))
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = submitMode === 'POST' ? (
            await postData(
                {
                    status: Number(values.status),
                    status_jenis_pegawai: values.status_jenis_pegawai,
                    kode_nip: Number(values.kode_nip)
                },
            )
        ) : (
            await updateData(
                `/master/employee-category/${selectedRecordId}`,
                {
                    status: Number(values.status),
                    status_jenis_pegawai: values.status_jenis_pegawai,
                    kode_nip: Number(values.kode_nip)
                },
            )
        )
        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} Kategori Pegawai ${response.data.status_jenis_pegawai}`,
            })
            employeeTypeForm.reset({
                status_jenis_pegawai: "",
                status: "1",
                kode_nip: 0
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateEmployeeType(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id_ms_jenis_pegawai_status, selectedRecord.status)
            }
        }
    }, [selectedRecord])
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data <br/> Master Kategori Pegawai
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...employeeTypeForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="status_jenis_pegawai"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Kategori Pegawai</FormLabel>
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
                                        name="kode_nip"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kode Kategori Pegawai</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field}
                                                               max={5}
                                                               min={1}
                                                               onChange={(e) => field.onChange(Number(e.target.value))}/>
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

export default UpdateOrCreateEmployeeCategory
