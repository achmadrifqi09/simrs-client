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
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {parentUnitValidation} from "@/validation-schema/work-unit";
import {ParentUnit, WorkUnit} from "@/types/work-unit";

type UpdateOrCreateWorkUnitProps = {
    onRefresh: () => void;
    selectedRecord: WorkUnit | null;
    setSelectedRecord: React.Dispatch<React.SetStateAction<WorkUnit | null>>;
    actionType: Action;
    permission: Permission | null;
    fieldId: number;
}

const UpdateOrCreateWorkUnit = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType,
                                    permission,
                                    fieldId
                                }: UpdateOrCreateWorkUnitProps) => {
    const workUnitForm = useForm<z.infer<typeof parentUnitValidation>>({
        resolver: zodResolver(parentUnitValidation),
        defaultValues: {
            nama_unit_kerja: "",
            jenis_pelayanan: "0",
            status: "1",
            kode_instalasi_bpjs: "",
            status_antrian: "0"
        }
    })

    const {data: session} = useSession();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/work-unit')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = workUnitForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        workUnitForm.reset();
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/work-unit/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status unit kerja ${selectedRecord?.nama_unit_kerja} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateWorkUnit = (workUnit: WorkUnit) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(workUnit.id)

        setValue('nama_unit_kerja', workUnit.nama_unit_kerja)
        setValue('jenis_pelayanan', workUnit.jenis_pelayanan.toString())
        setValue('status', workUnit.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const submitData: ParentUnit = {
            nama_unit_kerja: values.nama_unit_kerja,
            status: Number(values.status),
            status_antrian: Number(values.status_antrian) || 0,
            id_bidang: fieldId,
            is_parent_unit: 1,
            jenis_pelayanan: Number(values.jenis_pelayanan),
            kode_instalasi_bpjs: values.kode_instalasi_bpjs || "",
        }

        const response = submitMode === 'POST' ? (
            await postData(submitData)
        ) : (
            await updateData(
                `/work-unit/${selectedRecordId}`,
                submitData
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} unit kerja ${response.data.nama_unit_kerja}`,
            })
            workUnitForm.reset();
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateWorkUnit(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    {
                        permission?.can_create && (
                            <Button className="mb-4" onClick={handleOpenDialog}>Tambah Unit Kerja</Button>
                        )
                    }
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] w-full">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Unit Kerja
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...workUnitForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_unit_kerja"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Unit*</FormLabel>
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
                                        name="jenis_pelayanan"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Jenis Layanan*</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih jenis layanan"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="0">
                                                                        Unit Kerja
                                                                    </SelectItem>
                                                                    <SelectItem value="1">
                                                                        Poliklinik
                                                                    </SelectItem>
                                                                    <SelectItem value="2">
                                                                        Penunjang
                                                                    </SelectItem>
                                                                    <SelectItem value="3">
                                                                        IGD
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
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="kode_instalasi_bpjs"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Kode instalasi BPJS</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} value={field?.value || ''}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4 md:gap-6">
                                    <FormField
                                        control={control}
                                        name="status_antrian"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status Antrean*</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih status antrean"/>
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
                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status*</FormLabel>
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

export default UpdateOrCreateWorkUnit
