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

const ResidenceAddress = ({ control }: PersonalDataProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <FormField
                control={control}
                name="id_ms_negara_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Pilih Negara Tinggal*</FormLabel>
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
                )}
            />
            <FormField
                control={control}
                name="id_ms_provinsi_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Pilih Provinsi Tinggal*</FormLabel>
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
                )}
            />
            <FormField
                control={control}
                name="id_ms_kota_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Pilih Kota Tinggal*</FormLabel>
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
                )}
            />
            <FormField
                control={control}
                name="id_ms_kecamatan_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Pilih Kecamatan Tinggal*</FormLabel>
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
                )}
            />
            <FormField
                control={control}
                name="id_ms_desa_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Pilih Desa Tinggal*</FormLabel>
                        <FormControl>
                            <SelectSearch<Village>
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
                )}
            />
            <FormField
                control={control}
                name="rt_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>RT Tinggal*</FormLabel>
                        <FormControl>
                            <Input type="number" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="rw_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>RW Tinggal*</FormLabel>
                        <FormControl>
                            <Input type="number" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="kode_pos_tinggal"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Kode Pos Tinggal*</FormLabel>
                        <FormControl>
                            <Input type="number" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <div>
                <h1 className="mb-2">Alamat Tinggal*</h1>
                <FormField
                    name="alamat_tinggal"
                    control={control}
                    render={({field}) => (
                        <Textarea
                            {...field}
                            placeholder="Masukkan alamat tinggal..."
                            className="my-custom-class"
                        />
                    )}
                />
            </div>
        </div>
    )
}

export default ResidenceAddress
