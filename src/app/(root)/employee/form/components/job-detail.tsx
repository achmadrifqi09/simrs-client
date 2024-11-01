"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useState} from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import SelectSearch from "@/components/ui/select-search";
import {DoctorSpecialist, Education, EmployeeStatus, RankOrClass, StructuralPosition} from "@/types/master";
import {WorkUnit} from "@/types/work-unit";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarDays} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const JobDetail = ({
                       control
                   }: PersonalDataProps
) => {
    const [date, setDate] = useState<Date>();
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
                                        url="/master/marital-status?status=1"
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
                    name="id_ms_pendidikan"
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
                    name="id_ms_spesialis"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Spesialis</FormLabel>
                                <FormControl>
                                    <SelectSearch<DoctorSpecialist>
                                        url="/master/doktor-specialist?status=1"
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
                                    <SelectSearch<WorkUnit>
                                        url="/master/doktor-specialist?status=1"
                                        labelName="nama_unit_kerja"
                                        valueName="id_unit_induk"
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
                                        url="/master/rank-or-class?status=1"
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
                                        url="/master/struktural-position?status=1"
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
                <div className="w-full md:w-1/2">
                    <FormItem>
                        <FormLabel>Tanggal Masuk</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between text-left font-normal border-input",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    <CalendarDays className="ml-2 h-4 w-4"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage/>
                    </FormItem>
                </div>
                <div className="w-full md:w-1/2">
                    <FormItem>
                        <FormLabel>Tanggal keluar</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between text-left font-normal border-input",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    <CalendarDays className="ml-2 h-4 w-4"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage/>
                    </FormItem>
                </div>
            </div>
        </>
    )
}

export default JobDetail