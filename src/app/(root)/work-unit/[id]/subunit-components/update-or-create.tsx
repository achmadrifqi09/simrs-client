import {Action} from "@/enums/action";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {subunitValidation} from "@/validation-schema/work-unit";
import {zodResolver} from "@hookform/resolvers/zod";
import {Subunit, WorkUnit} from "@/types/work-unit";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";

type SubunitUpdateOrCreateProps = {
    parentUnit: WorkUnit | null;
    action: Action
    setAction: React.Dispatch<React.SetStateAction<Action>>;
    fieldId: number;
    selectedRecord: Subunit | null;
}
const SubunitUpdateOrCreate = ({
                                   parentUnit,
                                   action,
                                   fieldId,
                                   setAction,
                                   selectedRecord
                               }: SubunitUpdateOrCreateProps) => {
    const {data: session} = useSession();
    const {postData, postLoading, postError} = usePost('/work-unit')
    const {updateData, patchError, patchLoading} = usePatch()
    const subunitForm = useForm<z.infer<typeof subunitValidation>>({
        resolver: zodResolver(subunitValidation),
        defaultValues: {
            nama_unit_kerja: "",
            jenis_pelayanan: "1",
            kode_instalasi_bpjs: "",
            status_antrian: "1",
            status: "1",
        }
    })
    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const onUpdateSubunit = (subunit: Subunit) => {
        setSelectedRecordId(Number(subunit.id))

        setValue('nama_unit_kerja', subunit.nama_unit_kerja)
        setValue('jenis_pelayanan', subunit.jenis_pelayanan.toString())
        setValue('kode_instalasi_bpjs', subunit?.kode_instalasi_bpjs?.toString() || '')
        setValue('status', subunit.status.toString())
        setValue('status_antrian', subunit.status.toString())
    }



    const {handleSubmit, control, setValue} = subunitForm
    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const submitData: Subunit = {
            id_bidang: fieldId,
            id_unit_induk: isNaN(Number(parentUnit?.id)) ? 0 : Number(parentUnit?.id),
            nama_unit_kerja: values.nama_unit_kerja,
            status: Number(values.status),
            status_antrian: Number(values.status_antrian),
            kode_instalasi_bpjs: values?.kode_instalasi_bpjs || '',
            is_parent_unit: 0,
            jenis_pelayanan: Number(values.jenis_pelayanan)
        }

        const response = action === Action.CREATE ? (
            await postData(submitData)
        ) : (
            await updateData(
                `/work-unit/${selectedRecordId}`,
                submitData
            )
        )

        if (response?.data) {
            setAction(Action.VIEW)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${action === Action.CREATE ? 'menambah data'
                    : 'memperbarui data '} subunit kerja ${response.data.nama_unit_kerja}`,
            })
            subunitForm.reset();
        }
    });


    useEffect(() => {
        if (selectedRecord) {
            if (action === Action.UPDATE_FIELDS) return onUpdateSubunit(selectedRecord);
            // if (action === Action.UPDATE_STATUS || action === Action.UPDATE_QUEUE_STATUS) {
            //     updateStatus(Number(selectedRecord.id))
            // }
        }
    }, [selectedRecord])
    return (
        <>
            <Form {...subunitForm}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4 md:gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4 md:gap-6">
                        <FormField
                            control={control}
                            name="status_antrian"
                            render={({field}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4 md:gap-6">
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
        </>
    )
}

export default SubunitUpdateOrCreate