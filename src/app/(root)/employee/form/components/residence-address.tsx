"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import SelectSearch from "@/components/ui/select-search";
import {Country, District, Province, Regency, Village} from "@/types/master";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const ResidenceAddress = ({
                              control
                          }: PersonalDataProps
) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
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
                                        defaultValue={Number(field.value) || undefined}
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
                                        defaultValue={Number(field.value) || undefined}
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
                                        defaultValue={Number(field.value) || undefined}
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
                                    <SelectSearch<Village>
                                        url="/master/village?status=1"
                                        labelName="nama"
                                        valueName="id"
                                        placeholder="Masukkan kelurahan untuk mencari..."
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
                    name="rt_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>RT Asal</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value ?? ""}/>
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
                                    <Input type="text" {...field} value={field.value ?? ""}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="kode_pos_asal"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>kode Pos Asal</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value ?? ""}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />

                <div>
                    <h1 className="mb-2">Alamat Asal</h1>
                    <FormField
                        name="alamat_asal"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <Textarea
                                {...field}
                                placeholder="Enter your text here..."
                                className="my-custom-class"
                                value={field.value ?? ""}
                            />
                        )}
                    />
                </div>
            </div>
        </>
    )
}

export default ResidenceAddress