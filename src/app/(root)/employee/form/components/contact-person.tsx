"use client"

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";
import {Control} from "react-hook-form";
import {EmployeeForm} from "@/app/(root)/employee/form/form";

interface PersonalDataProps {
    control: Control<EmployeeForm>;
}

const ContactPerson = ({
                              control
                          }: PersonalDataProps
) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <FormField
                    control={control}
                    name="hp"
                    render={({field}) => {
                        return (
                            <FormItem>
                                <FormLabel>No Hp</FormLabel>
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }}/>
            </div>
        </>
    )
}

export default ContactPerson
