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
import {countryValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {NextAuthSession} from "@/types/session";
import type {CountryDTO} from "@/types/master";
import {Action} from "@/enums/action";

type UpdateOrCreateCountryProps = {
    onRefresh: () => void,
    selectedRecord: CountryDTO | null,
    setSelectedRecord:React.Dispatch<React.SetStateAction<CountryDTO | null>>
    actionType: Action
}

const UpdateOrCreateCountry = ({onRefresh, selectedRecord, setSelectedRecord, actionType}: UpdateOrCreateCountryProps) => {
    const countryForm = useForm<z.infer<typeof countryValidation>>({
        resolver: zodResolver(countryValidation),
        defaultValues: {
            nama: "",
            status: "1"
        }
    })

    const {data: session} = useSession() as { data: NextAuthSession };
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postData, postLoading, postError} = usePost('/master/country')
    const {updateData, patchError, patchLoading} = usePatch()
    const {handleSubmit, control, setValue} = countryForm

    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);

    const handleOpenDialog = () => {
        setShowDialog(!showDialog)
        setSubmitMode('POST')
    }

    const handleCloseDialog = () => {
        setValue('nama', "")
        setValue('status', '1')
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const updateStatus = async (id: number | undefined, status: number | undefined) => {
        const response = await updateData(
            `/master/country/${id}/status`,
            {status: status === 1 ? 0 : 1},
        )

        if (response?.status_code === 200) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate status negara ${selectedRecord?.nama} 
                menjadi ${status === 0 ? 'Aktif' : 'Tidak Aktif'}`,
            })
        }
    }

    const onUpdateCountry = (countryForm: CountryDTO) => {
        setSubmitMode('PATCH')
        setShowDialog(true)
        setSelectedRecordId(countryForm.id_ms_negara)
        setValue('nama', countryForm.nama)
        setValue('status', countryForm.status.toString())
    }

    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const response = submitMode === 'POST' ? (
            await postData(
                {status: Number(values.status), nama: values.nama},
            )
        ) : (
            await updateData(
                `/master/country/${selectedRecordId}`,
                {status: Number(values.status), nama: values.nama},
            )
        )

        if (response?.data) {
            setShowDialog(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '} negara ${response.data.nama}`,
            })
            countryForm.reset({
                nama: "",
                status: "1"
            })
            onRefresh();
        }
    });

    useEffect(() => {
       if(selectedRecord){
           if(actionType === Action.UPDATE_FIELDS) onUpdateCountry(selectedRecord);
           if(actionType === Action.UPDATE_STATUS) {
               updateStatus(selectedRecord.id_ms_negara, selectedRecord.status)
           }
       }
    }, [selectedRecord])

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                    <Button className="mb-4" onClick={handleOpenDialog}>Tambah</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Master Negara
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...countryForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="nama"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Nama Negara</FormLabel>
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
