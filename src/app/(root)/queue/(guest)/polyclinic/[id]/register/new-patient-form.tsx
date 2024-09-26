import {Button} from "@/components/ui/button";
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {newPatientSchema} from "@/validation-schema/queue-register";
import {zodResolver} from "@hookform/resolvers/zod";
import {Gender} from "@/enums/common";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import Heading from "@/components/ui/heading";


const NewPatientForm = () => {
    const newPatientForm = useForm<z.infer<typeof newPatientSchema>>({
        resolver: zodResolver(newPatientSchema),
        defaultValues: {
            name: "",
            gender: Gender.MALE,
            phone_number: "",
            day_of_birth: "",
            month_and_year: "",
        }
    })

    const {handleSubmit, control} = newPatientForm

    const onSubmit = handleSubmit((values) => {
        console.log(values)
    })

    return (
        <div className="mt-6">
            <Heading headingLevel="h4">
                Formulir Pasien Baru
            </Heading>

            <Form {...newPatientForm}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <FormField
                            control={control}
                            name="name"
                            render={({field}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}/>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="day_of_birth"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Tanggal Lahir</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} max={31} {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                            <FormField
                                control={control}
                                name="month_and_year"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Bulan dan Tahun Lahir</FormLabel>
                                            <FormControl>
                                                <Input type="month"  {...field} className="block"/>
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Tekan ikon kalender untuk memilih
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                        <FormField
                            control={control}
                            name="gender"
                            render={({field}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Jenis Kelamin</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis kelamin"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value={Gender.MALE}>Laki-Laki</SelectItem>
                                                        <SelectItem value={Gender.FEMALE}>Perempuan</SelectItem>
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
                            name="phone_number"
                            render={({field}) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Nomor Telepon</FormLabel>
                                        <FormControl>
                                            <Input type="tel"  {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}/>
                    </div>
                    <div className="flex justify-end mt-8">
                        <Button type="submit" className="min-w-[10em] mt-4">
                            Daftar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NewPatientForm