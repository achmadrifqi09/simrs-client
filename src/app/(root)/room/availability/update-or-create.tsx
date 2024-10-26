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
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {availabilityValidation} from "@/validation-schema/master";
import {zodResolver} from "@hookform/resolvers/zod";
import type {Bed} from "@/types/master";
import {Action} from "@/enums/action";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Permission} from "@/types/permission";

type UpdateOrCreatedRoomProps = {
    onRefresh: () => void,
    selectedRecord: Bed | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<Bed | null>>
    actionType: Action,
    permission: Permission | null
}

const UpdateOrCreatedRoom = ({
                                 onRefresh,
                                 selectedRecord,
                                 setSelectedRecord,
                                 actionType
                             }: UpdateOrCreatedRoomProps) => {
    const availabilityForm = useForm<z.infer<typeof availabilityValidation>>({
        resolver: zodResolver(availabilityValidation),
        defaultValues: {
            status_bed: '0',
        }
    })
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [submitMode] = useState<'POST' | 'PATCH'>('POST');

    const {postLoading, postError, setPostError} = usePost('/master/bed')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control} = availabilityForm


    const handleCloseDialog = () => {
        availabilityForm.reset();
        setShowDialog(!showDialog)
        setSelectedRecord(null)
    }

    const onSubmit = handleSubmit(async (values) => {
        const response = await updateData(
            `/master/bed/${selectedRecord?.id}/availability`,
            {status_bed: Number(values.status_bed)},
        )

        if (response?.status_code === 200) {
            setShowDialog(false)
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil mengupdate Status Kamar`,
            })
        }
    });
    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_STATUS) {
                setShowDialog(true)
                availabilityForm.setValue('status_bed', selectedRecord.status_bed.toString())
            }
        }
    }, [selectedRecord])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        availabilityForm.clearErrors()
    }, [showDialog]);

    return (
        <div>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {submitMode === 'POST' ? 'Tambah ' : 'Update '} Data Ketersediaan kamar
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...availabilityForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="status_bed"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Status Kasur</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Status kamar .."/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="0">Siap Digunakan</SelectItem>
                                                                    <SelectItem value="1">Digunakan</SelectItem>
                                                                    <SelectItem value="2">Dibersihkan</SelectItem>
                                                                    <SelectItem value="3">Rusak</SelectItem>
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
