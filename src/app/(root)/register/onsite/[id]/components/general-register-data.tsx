"use client"

import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {generalRegisterValidation} from "@/validation-schema/general-register";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import Heading from "@/components/ui/heading";

const GeneralRegisterData = () => {
    const generalRegister = useForm<z.infer<typeof generalRegisterValidation>>({
        resolver: zodResolver(generalRegisterValidation),
        defaultValues: {
            jenis_pasien: 1,
            jenis_penjamin: 1,
            no_asuransi: 0,
            no_asuransi_cob: 1,
            pihak_kedua: 0,
            biaya_kartu: 1,
            jasa_dokter: 1,
            biaya_pendaftaran: 0,
            tgl_kunjungan: "25-11-2024"
        }
    })
    const {control} = generalRegister
    return (
        <>
            <div>
                <Heading variant="section-title" headingLevel="h5">
                    Layanan:
                </Heading>
            </div>
            <Form {...generalRegister}>
                <form>
                    <div className="my-4">
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            <FormField
                                control={control}
                                name="jenis_penjamin"
                                render={() => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Jenis Penjamin</FormLabel>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Jenis Penjamin"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">Umum</SelectItem>
                                                        <SelectItem value="2">BPJS</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )
                                }}/>
                            <FormField
                                control={control}
                                name="tgl_kunjungan"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Tanggal Kunjungan</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                        </div>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-2">
                            <FormField
                                control={control}
                                name="no_asuransi"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nomor Asuransi</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                            <FormField
                                control={control}
                                name="jenis_pasien"
                                render={() => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Pasien Baru*</FormLabel>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup defaultValue="1">
                                                        <SelectItem value="1">Tidak</SelectItem>
                                                        <SelectItem value="2">Ya</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )
                                }}/>
                        </div>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-2">
                            <FormField
                                control={control}
                                name="jenis_penjamin"
                                render={() => {
                                    return (
                                        <FormItem>
                                            <FormLabel>COB</FormLabel>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">Ada</SelectItem>
                                                        <SelectItem value="2">Tidak</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )
                                }}/>
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                                <FormField
                                    control={control}
                                    name="biaya_pendaftaran"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Biaya Pendaftaran*</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                                <FormField
                                    control={control}
                                    name="no_asuransi_cob"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Diskon ( % )</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-2">
                            <FormField
                                control={control}
                                name="no_asuransi_cob"
                                render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nomor Asuransi COB</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                                <FormField
                                    control={control}
                                    name="biaya_kartu"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Biaya Kartu*</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                                <FormField
                                    control={control}
                                    name="no_asuransi_cob"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Diskon ( % )</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mt-2">
                            <div></div>
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                                <FormField
                                    control={control}
                                    name="jasa_dokter"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Jasa Dokter*</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                                <FormField
                                    control={control}
                                    name="no_asuransi_cob"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Diskon ( % )</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default GeneralRegisterData
