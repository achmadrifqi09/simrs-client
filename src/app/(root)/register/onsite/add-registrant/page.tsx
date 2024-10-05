"use client";
import Section from "@/components/ui/section";
import React from "react";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import {oldPatientSchema} from "@/validation-schema/queue-register";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PatientType} from "@/enums/common";
import * as z from "zod";
import {Input} from "@/components/ui/input";

const AddRegistrant = () => {
    const addRegistrantForm = useForm<z.infer<typeof oldPatientSchema>>({
        resolver: zodResolver(oldPatientSchema),
        defaultValues: {
            patient_type: PatientType.BPJS,
            identifier_number: "",
        },
    });

    const {handleSubmit, control} = addRegistrantForm;

    const onSubmit = handleSubmit((values) => {
        console.log(values);
    });

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">
                Tambah Pendaftar
            </Heading>

            <Section>
                <Heading headingLevel="h5">Form Pendaftaran</Heading>
                <div className="text-gray-500">
                    <p>
                        Jika pasien belum memiliki riwayat rekam medis, tambahkan pasien
                        baru di{" "}
                        <Link
                            className="text-primary italic underline-offset-4 hover:underline"
                            href="javascript:void(0)"
                        >
                            link ini
                        </Link>
                        . Kemudian, kembali ke halaman ini untuk mendaftarkan pasien ke
                        poliklinik.
                    </p>
                </div>

                <Form {...addRegistrantForm}>
                    <form onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Patient Type Dropdown */}
                            <FormField
                                control={control}
                                name="patient_type"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Jenis Pasien</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jenis pasien"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value={PatientType.BPJS}>
                                                            BPJS
                                                        </SelectItem>
                                                        <SelectItem value={PatientType.GENERAL}>
                                                            Umum
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* Identifier Number Input */}
                            <FormField
                                control={control}
                                name="identifier_number"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nomor Identitas</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan nomor identitas"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </Section>
        </>
    );
};

export default AddRegistrant;
