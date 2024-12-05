"use client"

import {useForm} from "react-hook-form";
import {z} from "zod";
import {cancelValidation} from "@/validation-schema/patient";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import React, {useEffect} from "react";
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
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface CancelDialogProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
    id: number | undefined;
    onRefresh: () => void,
}

const CancelDialog = ({
                          setShow,
                          show,
                          id,
                          onRefresh
                      }: CancelDialogProps) => {
    const CancelForm = useForm<z.infer<typeof cancelValidation>>({
        resolver: zodResolver(cancelValidation),
        defaultValues: {
            keterangan_batal: ""
        }
    })
    const {data: session} = useSession();
    const {control, handleSubmit, setValue} = CancelForm
    const {updateData, patchError, patchLoading} = usePatch()
    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = await updateData(
            `/registration/${id}/cancellation`,
            {
                keterangan_batal: values.keterangan_batal,
                status_batal: 1
            }
        )
        if (response?.data) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: 'Berhasil Memperbarui data Pelayanan',
            })
            setShow(false)
            CancelForm.reset({
                keterangan_batal: ""
            })
        }
    });

    useEffect(() => {
        setValue('keterangan_batal', '')
    }, [show]);
    return (
        <>
            <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Keterangan Libur
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...CancelForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="keterangan_batal"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Keterangan Batal</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <FormError
                                    errors={patchError}
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={patchLoading}>
                                        {
                                            (patchLoading) ? (
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
        </>
    )
}
export default CancelDialog;
