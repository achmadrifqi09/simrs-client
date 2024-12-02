"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import SelectSearch from "@/components/ui/select-search";
import {Country, District, Province, Regency} from "@/types/master";
import {Input} from "@/components/ui/input";
import React from "react";
import {Control} from "react-hook-form";
import {PatientType} from "@/types/patient";
import Heading from "@/components/ui/heading";

interface OriginAddressProps {
    control: Control<PatientType>;
}

const OriginAddress = ({
                           control
                       }: OriginAddressProps) => {
    return (
        <div className="mt-6">
            <Heading variant="section-title" headingLevel="h5" className="mb-0">Asal</Heading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-0">
                <FormField
                    control={control}
                    name="id_ms_negara_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Negara Asal</FormLabel>
                                <FormControl>
                                    <SelectSearch<Country>
                                        url="/master/country?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan Negara untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_provinsi_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Provinsi Asal</FormLabel>
                                <FormControl>
                                    <SelectSearch<Province>
                                        url="/master/province?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan Provinsi untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_kota_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Kota Asal</FormLabel>
                                <FormControl>
                                    <SelectSearch<Regency>
                                        url="/master/regency?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan kota untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_kecamatan_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Kecamatan Asal</FormLabel>
                                <FormControl>
                                    <SelectSearch<District>
                                        url="/master/district?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan kecamatan untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_desa_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Kelurahan Asal</FormLabel>
                                <FormControl>
                                    <SelectSearch<District>
                                        url="/master/village?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan kelurahan untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="rt_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>RT Asal</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="rw_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>RW Asal</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="alamat_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Alamat Asal</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="kode_pos_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Alamat Asal</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
            </div>
        </div>

    )
}

export default OriginAddress
