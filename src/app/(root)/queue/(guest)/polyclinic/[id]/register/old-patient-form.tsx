"use client"
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {oldPatientSchema} from "@/validation-schema/queue-register";
import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {PatientType} from "@/enums/common";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Input} from "@/components/ui/input";
import Heading from "@/components/ui/heading";


const OldPatientForm = () => {
    const oldPatientForm = useForm<z.infer<typeof oldPatientSchema>>({
        resolver: zodResolver(oldPatientSchema),
        defaultValues: {
            patient_type: PatientType.BPJS,
            identifier_number: ""
        }
    })
    const {handleSubmit, control} = oldPatientForm

    const onSubmit = handleSubmit((values) => {
        console.log(values)
    })

    return (
        <>
            <Heading headingLevel="h4">Formulir Pasien Lama</Heading>
            <Form {...oldPatientForm}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <FormField
                                control={control}
                                name="patient_type"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Jenis Pasien</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis pasien"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value={PatientType.BPJS}>Pasien
                                                                BPJS</SelectItem>
                                                            <SelectItem value={PatientType.GENERAL}>Pasien
                                                                Umum</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>

                                    )
                                }}/>
                            <div className="flex gap-4 w-full">
                                <FormField
                                    control={control}
                                    name="identifier_number"
                                    render={({field}) => {
                                        return (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    {oldPatientForm.getValues('patient_type') === PatientType.BPJS ? "Nomor RM/BPJS/NIK" : "Nomor RM/NIK"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} placeholder={
                                                        oldPatientForm.getValues('patient_type') === PatientType.BPJS ?
                                                            "Masukkan nomor RM/BPJS/NIK (pilih salah satu)" :
                                                            "Masukkan nomor RM/NIK (pilih salah satu)"}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>

                                        )
                                    }}/>
                                <Button variant="outline" type="button" className="mt-8">
                                    Cari
                                </Button>
                            </div>
                            <div className="flex justify-end w-full mt-4">
                                <Button type="submit" className="min-w-[10em] hidden">
                                    Daftar
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="w-full border border-gray-200 p-4 mt-8 rounded-lg">
                                <p>Keterangan</p>
                                <div className="bg-gray-50 mt-2 p-4 rounded-md">
                                    <p className="text-gray-500 text-sm">
                                        Masukkan nomor {
                                        oldPatientForm.getValues('patient_type') === PatientType.BPJS ?
                                            "RM/BPJS/NIK" :
                                            "RM/NIK"
                                    }{" "}
                                        kemudian cari untuk menampilkan keterangan pasien</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default OldPatientForm