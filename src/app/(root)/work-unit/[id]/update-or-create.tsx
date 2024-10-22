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
import {workUnitValidation} from "@/validation-schema/work-unit";
import {WorkUnit} from "@/types/work-unit";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import SelectSearch from "@/components/ui/select-search";

type UpdateOrCreateWorkUnitProps = {
    onRefresh: () => void,
    selectedRecord: WorkUnit | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<WorkUnit | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreateWorkUnit = ({
                                    onRefresh,
                                    selectedRecord,
                                    setSelectedRecord,
                                    actionType,
                                    permission
                                }: UpdateOrCreateWorkUnitProps) => {
    const workUnitForm = useForm<z.infer<typeof workUnitValidation>>({
        resolver: zodResolver(workUnitValidation),
        defaultValues: {
            nama_unit_kerja: "",
            jenis_pelayanan: "0",
            kode_instalasi_bpjs: null,
            status_antrian: "0",
            status: "1",
            id_unit_induk: null,
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

    const onUpdateBloodType = (workUnit: WorkUnit) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(workUnit.id_unit_kerja)

        setValue('nama_unit_kerja', workUnit.nama_unit_kerja)
        setValue('jenis_pelayanan', workUnit.jenis_pelayanan.toString())
        setValue('kode_instalasi_bpjs', workUnit.kode_instalasi_bpjs || '')
        setValue('status_antrian', workUnit.status_antrian.toString())
        setValue('id_unit_induk', workUnit.id_unit_induk)
        setValue('status', workUnit.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const submitData: WorkUnit = {
            nama_unit_kerja: values.nama_unit_kerja,
            status: Number(values.status),
            status_antrian: Number(values.status_antrian),
            jenis_pelayanan: Number(values.jenis_pelayanan),
        }

        if(values.id_unit_induk) submitData.id_unit_induk = values.id_unit_induk
        if(values.kode_instalasi_bpjs) submitData.kode_instalasi_bpjs = values.kode_instalasi_bpjs
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
                    : 'memperbarui data '} unit kerja ${response.data.nama_golongan_darah}`,
            })
            workUnitForm.reset();
            onRefresh();
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateBloodType(selectedRecord);
            if (actionType === Action.UPDATE_STATUS) {
                updateStatus(selectedRecord.id_unit_kerja, selectedRecord.status)
            }
        }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    {
                        (permission?.can_create) && (

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
                                <Tabs defaultValue="unit" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="unit">Unit Induk</TabsTrigger>
                                        <TabsTrigger value="subunit">Subunit</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="subunit">
                                        <div className="my-4">
                                            <FormField
                                                control={control}
                                                name="id_unit_induk"
                                                render={({field}) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel>Unit Induk</FormLabel>
                                                            <FormControl>
                                                                <SelectSearch<WorkUnit>
                                                                    url="/work-unit"
                                                                    labelName="nama_unit_kerja"
                                                                    valueName="id_unit_kerja"
                                                                    placeholder="Masukkan nama unit induk..."
                                                                    onChange={field.onChange}
                                                                    defaultValue={field.value || undefined}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )
                                                }}/>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama_unit_kerja"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Unit</FormLabel>
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
                                                    <FormLabel>Jenis Layanan</FormLabel>
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
                                                    <FormLabel>Kode Instalasi BPJS</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} value={field.value || ''}/>
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

                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="status_antrian"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status Antrean</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Pilih status antrean"/>
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
