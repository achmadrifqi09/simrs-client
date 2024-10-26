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
import {employeeTypeValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import type {EmployeeCategory, EmployeeType} from "@/types/master";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateEmployeeTypeProps = {
    onRefresh: () => void,
    selectedRecord: EmployeeType | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<EmployeeType | null>>
    actionType: Action
    permission: Permission | null
}

const UpdateOrCreateEmployeeType = ({
                                        onRefresh,
                                        selectedRecord,
                                        setSelectedRecord,
                                        actionType,
                                        permission
                                    }: UpdateOrCreateEmployeeTypeProps) => {
    const employeeTypeForm = useForm<z.infer<typeof employeeTypeValidation>>({
        resolver: zodResolver(employeeTypeValidation),
        defaultValues: {
            nama_jenis_pegawai: "",
            status: "1",
            id_ms_jenis_pegawai_status: 0
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/employee-type')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = employeeTypeForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('nama_jenis_pegawai', "")
        setValue('status', '1')
        setValue('id_ms_jenis_pegawai_status', 0)
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/employee-type/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate Jenis Pegawai ${selectedRecord?.nama_jenis_pegawai} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateEmployeeType = (employeeTypeForm: EmployeeType) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(Number(employeeTypeForm.id_ms_jenis_pegawai))
        setValue('nama_jenis_pegawai', employeeTypeForm.nama_jenis_pegawai.toString())
        setValue('status', employeeTypeForm.status.toString())
        setValue('id_ms_jenis_pegawai_status', employeeTypeForm.id_ms_jenis_pegawai_status)
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {
                    status: Number(values.status),
                    nama_jenis_pegawai: values.nama_jenis_pegawai,
                    id_ms_jenis_pegawai_status: values.id_ms_jenis_pegawai_status
                },
            )
        ) : (
            await updateData(
                `/master/employee-type/${selectedRecordId}`,
                {
                    status: Number(values.status),
                    nama_jenis_pegawai: values.nama_jenis_pegawai,
                    id_ms_jenis_pegawai_status: values.id_ms_jenis_pegawai_status
                },
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} Jenis Pegawai ${response.data.nama_jenis_pegawai}`,
            })
            employeeTypeForm.reset({
                nama_jenis_pegawai: "",
                status: "1",
                id_ms_jenis_pegawai_status: 0
            })
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateEmployeeType(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(Number(selectedRecord.id_ms_jenis_pegawai), selectedRecord.status)
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
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Nama Jenis Pegawai
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...employeeTypeForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="id_ms_jenis_pegawai_status"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Kategori Pegawai</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<EmployeeCategory>
                                                            url="/master/employee-category?status=1"
                                                            labelName="status_jenis_pegawai"
                                                            valueName="id_ms_jenis_pegawai_status"
                                                            placeholder="Pilih kamar..."
                                                            onChange={field.onChange}
                                                            defaultValue={field.value || undefined}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </div>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_jenis_pegawai"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Jenis Pegawai</FormLabel>
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

export default UpdateOrCreateEmployeeType
