'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Control } from 'react-hook-form';
import { PatientType } from '@/types/patient';
import Heading from '@/components/ui/heading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientIdentityProps {
    control: Control<PatientType>;
}

const PatientIdentity = ({ control }: PatientIdentityProps) => {
    return (
        <>
            <div className="mt-8">
                <Heading variant="section-title" headingLevel="h5" className="mb-0">
                    Identitas Pasien
                </Heading>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 my-0">
                    <FormField
                        control={control}
                        name="identitas_pasien"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Jenis Identitas</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Jenis Identitas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="1">KTP</SelectItem>
                                                    <SelectItem value="2">Paspor</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={control}
                        name="no_identitas"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Nomor Identitas*</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={control}
                        name="no_hp"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Nomor Hp*</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={control}
                        name="no_bpjs"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Nomor BPJS*</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default PatientIdentity;
