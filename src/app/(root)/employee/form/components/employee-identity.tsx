"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import SelectSearch from "@/components/ui/select-search";
import {BloodType, MaritalStatus, Religion} from "@/types/master";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const EmployeeIdentity = ({
                              control
                          }: PersonalDataProps
) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <FormField
                    control={control}
                    name="nama_pegawai"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Nama Pegawai*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="nip_pegawai"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>NIP Pegawai*</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field} // Ensure field.value is a string here
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="no_ktp"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>No. KTP*</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="nip_pns"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>NIP PNS</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={Number(field.value)}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="id_jenis_kelamin"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Jenis kelamin</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value) || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis Kelamin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1">Laki - laki</SelectItem>
                                                <SelectItem value="2">Perempuan</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="gelar_depan"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Gelar Depan</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="gelar_belakang"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Gelar Belakang</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} value={field.value ?? ""}/>
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
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="id_ms_golongan_darah"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Golongan Darah</FormLabel>
                                <FormControl>
                                    <SelectSearch<BloodType>
                                        url="/master/blood-type?status=1"
                                        labelName="nama_golongan_darah"
                                        valueName="id_ms_golongan_darah"
                                        placeholder="Masukkan golongan..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
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
                <FormField
                    control={control}
                    name="hp"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>No Hp*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="email"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
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
                                <FormLabel>Pilih Status Kawin*</FormLabel>
                                <FormControl>
                                    <SelectSearch<MaritalStatus>
                                        url="/master/marital-status?status=1"
                                        labelName="nama_status_kawin"
                                        valueName="id_ms_status_kawin"
                                        placeholder="Masukkan status kawin untuk mencari..."
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
                                <FormLabel>Pilih Agama*</FormLabel>
                                <FormControl>
                                    <SelectSearch<Religion>
                                        url="/master/religion?status=1"
                                        labelName="nama_agama"
                                        valueName="id_ms_agama"
                                        placeholder="Masukkan agama untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
            </div>
        </>
    )
}

export default EmployeeIdentity
