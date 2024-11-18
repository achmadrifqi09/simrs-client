"use client"
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React from "react";
import {Control} from "react-hook-form";
import SelectSearch from "@/components/ui/select-search";
import {BloodType, Education, MaritalStatus, Religion} from "@/types/master";
import Heading from "@/components/ui/heading";
import {PatientType} from "@/types/patient";

interface PersonalDataProps {
    control: Control<PatientType>;
}

const PersonalData = ({
                          control
                      }: PersonalDataProps) => {
    return (
        <div className="mt-0">
            <Heading variant="section-title" headingLevel="h5" className="mb-0">Data Pribadi</Heading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
                <FormField
                    control={control}
                    name="kode_rm"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Kode RM*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="nama_pasien"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Nama Pasien*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="tempat_lahir"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Tempat Lahir*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="tgl_lahir"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Tanggal Lahir*</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field}
                                           value={field.value.toString().split('T')[0]}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormItem>
                    <FormLabel>Jenis Kelamin*</FormLabel>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis Kelamin"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Laki - laki</SelectItem>
                                <SelectItem value="2">Perempuan</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormItem>
                <FormField
                    control={control}
                    name="id_ms_golongan_darah"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Golongan Darah</FormLabel>
                                <FormControl>
                                    <SelectSearch<BloodType>
                                        url="/master/blood-type?status=1"
                                        labelName="nama_golongan_darah"
                                        valueName="id_ms_golongan_darah"
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
                    name="id_ms_agama"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Agama</FormLabel>
                                <FormControl>
                                    <SelectSearch<Religion>
                                        url="/master/religion?status=1"
                                        labelName="nama_agama"
                                        valueName="id_ms_agama"
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
                    name="nama_ibu_kandung"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Nama Ibu Kandung*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="suku"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Suku</FormLabel>
                                <FormControl>
                                    <Input value={field.value || ''} onChange={field.onChange}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_warga_negara"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Warga Negara*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_pendidikan"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Tingkat Pendidikan</FormLabel>
                                <FormControl>
                                    <SelectSearch<Education>
                                        url="/master/education-level?status=1"
                                        labelName="nama_tingkat_pendidikan"
                                        valueName="id_ms_tingkat_pendidikan"
                                        placeholder="Masukkan Pendidikan untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormItem>
                    <FormLabel>Status Hidup*</FormLabel>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih status hidup"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Hidup</SelectItem>
                                <SelectItem value="2">Meninggal</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormItem>
                <FormField
                    control={control}
                    name="nama_pekerjaan"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Nama Pekerjaan</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="id_ms_status_kawin"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Status Kawin</FormLabel>
                                <FormControl>
                                    <SelectSearch<MaritalStatus>
                                        url="/master/marital-status?status=1"
                                        labelName="nama_status_kawin"
                                        valueName="id_ms_status_kawin"
                                        placeholder="Masukkan Negara untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
            </div>
        </div>
    )
}

export default PersonalData
