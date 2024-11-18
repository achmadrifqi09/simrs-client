import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import {Loader2} from "lucide-react";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {vacationScheduleValidation} from "@/validation-schema/doctor-schedule";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {usePatch} from "@/hooks/use-patch";
import {dateFormatter} from "@/utils/date-formatter";


interface VacationDialogProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
    id: number | undefined;
    vacation_date: Date | undefined;
    onRefresh: () => void,
}

const DoctorVacationDialog = ({
                                  setShow,
                                  show,
                                  id,
                                  vacation_date,
                                  onRefresh
                              }: VacationDialogProps) => {
    const doctorScheduleForm = useForm<z.infer<typeof vacationScheduleValidation>>({
        resolver: zodResolver(vacationScheduleValidation),
        defaultValues: {
            keterangan_libur: ""
        }
    })
    const {data: session} = useSession();
    const {control, handleSubmit, setValue} = doctorScheduleForm
    const {updateData, patchError, patchLoading} = usePatch()
    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const response = await updateData(
            `/doctor-schedule/${id}/vacation`,
            {
                keterangan_libur: values.keterangan_libur,
                tanggal_libur: dateFormatter(vacation_date)
            }
        )
        if (response?.data) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: 'Berhasil Memperbarui data jadwal libur',
            })
            setShow(false)
            doctorScheduleForm.reset({
                keterangan_libur: ""
            })
        }
    });

    useEffect(() => {
        setValue('keterangan_libur', '')
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
                        <Form {...doctorScheduleForm}>
                            <form onSubmit={onSubmit}>
                                <div className="my-4">
                                    <FormField
                                        control={control}
                                        name="keterangan_libur"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Keterangan Libur</FormLabel>
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

export default DoctorVacationDialog
