"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import SelectSearch from "@/components/ui/select-search";
import {MaritalStatus, Religion} from "@/types/master";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const FamilyStatus = ({
                          control
                      }: PersonalDataProps
) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <FormField
                    control={control}
                    name="id_ms_status_kawin"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Pilih Status Kawin</FormLabel>
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
                                <FormLabel>Pilih Agama</FormLabel>
                                <FormControl>
                                    <SelectSearch<Religion>
                                        url="/master/regligion?status=1"
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

export default FamilyStatus
