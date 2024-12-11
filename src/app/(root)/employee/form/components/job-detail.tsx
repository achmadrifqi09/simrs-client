"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import SelectSearch from "@/components/ui/select-search";
import {
    DoctorSpecialist,
    Education,
    EmployeeCategory,
    EmployeeStatus,
    RankOrClass,
    StructuralPosition
} from "@/types/master";
import {ParentUnit, WorkUnit} from "@/types/work-unit";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const JobDetail = ({
                       control
                   }: PersonalDataProps
) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
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
                <FormField
                    control={control}
                    name="id_ms_status_pegawai"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Status Pegawai</FormLabel>
                                <FormControl>
                                    <SelectSearch<EmployeeStatus>
                                        url="/master/employee-status?status=1"
                                        labelName="nama_status_pegawai"
                                        valueName="id_ms_status_pegawai"
                                        placeholder="Masukkan Status Pegawai untuk mencari..."
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
                    name="id_ms_jenis_pegawai"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Jenis Pegawai</FormLabel>
                                <FormControl>
                                    <SelectSearch<EmployeeCategory>
                                        url="/master/employee-category?status=1"
                                        labelName="status_jenis_pegawai"
                                        valueName="id_ms_jenis_pegawai_status"
                                        placeholder="Masukkan Pendidikan untuk mencari..."
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
                    name="id_ms_spesialis"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Spesialis</FormLabel>
                                <FormControl>
                                    <SelectSearch<DoctorSpecialist>
                                        url="/master/specialist?status=1"
                                        labelName="nama_spesialis"
                                        valueName="id_ms_spesialis"
                                        placeholder="Masukkan Spesialis untuk mencari..."
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
                    name="id_unit_induk"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Unit Induk</FormLabel>
                                <FormControl>
                                    <SelectSearch<ParentUnit>
                                        url="/work-unit"
                                        labelName="nama_unit_kerja"
                                        valueName="id"
                                        placeholder="Masukkan Unit untuk mencari..."
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
                    name="id_unit_kerja"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Unit Kerja</FormLabel>
                                <FormControl>
                                    <SelectSearch<WorkUnit>
                                        url="/work-unit/status/active"
                                        labelName="nama_unit_kerja"
                                        valueName="id"
                                        placeholder="Masukkan Unit untuk mencari..."
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
                    name="id_pangkat"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Pangkat</FormLabel>
                                <FormControl>
                                    <SelectSearch<RankOrClass>
                                        url="/master/employee-rank?status=1"
                                        labelName="nama_pangkat"
                                        valueName="id_ms_pangkat"
                                        placeholder="Masukkan Pangkat untuk mencari..."
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
                    name="id_jabatan"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Jabatan</FormLabel>
                                <FormControl>
                                    <SelectSearch<StructuralPosition>
                                        url="/master/structural-position?status=1"
                                        labelName="nama_jabatan"
                                        valueName="id_ms_jabatan"
                                        placeholder="Masukkan Jabatan untuk mencari..."
                                        onChange={field.onChange}
                                        defaultValue={Number(field.value) || undefined}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <div className="w-full">
                    <FormField
                        control={control}
                        name="tgl_masuk"
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Tanggal Masuk*</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            value={field.value ? field.value.toString().split('T')[0] : ""}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            );
                        }}
                    />
                </div>
                <div className="w-full">
                    <FormField
                        control={control}
                        name="tgl_keluar"
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Tanggal Keluar</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field}
                                               value={field.value ? field.value.toString().split('T')[0] : ""}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>
                </div>
                <FormField
                    control={control}
                    name="status_pns"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Status PNS*</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value) || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status PNS"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="0">Tidak</SelectItem>
                                                <SelectItem value="1">Ya</SelectItem>
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
                    name="status_aktif"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Status Aktif*</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={String(field.value) || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status aktif"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="0">Tidak</SelectItem>
                                                <SelectItem value="1">Ya</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        );
                    }}
                />
            </div>
        </>
    )
}

export default JobDetail
