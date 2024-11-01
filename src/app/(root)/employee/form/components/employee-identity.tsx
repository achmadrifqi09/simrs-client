"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarDays} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import SelectSearch from "@/components/ui/select-search";
import {BloodType} from "@/types/master";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const EmployeeIdentity = ({
                              control
                          }: PersonalDataProps
) => {
    const [date, setDate] = useState<Date>();
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <FormField
                    control={control}
                    name="nama_pegawai"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Nama Pegawai</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
                <FormField
                    control={control}
                    name="no_ktp"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>No. KTP</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                    control={control}
                    name="nip_pns"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>NIP PNS</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                    control={control}
                    name="gelar_depan"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Gelar Depan</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
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
                                    <Input type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormField
                    control={control}
                    name="tempat_lahir"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Tempat Lahir</FormLabel>
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
                <div className="w-full md:w-1/2">
                    <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
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

export default EmployeeIdentity
