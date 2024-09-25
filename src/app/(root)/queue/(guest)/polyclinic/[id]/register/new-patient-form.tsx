import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
// import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";



const NewPatientForm = () => {
    return (
        <form>
            <div className="my-4">
                <Label htmlFor="patientType">Jenis Pasien</Label>
                <Select>
                    <SelectTrigger id="patientType">
                        <SelectValue placeholder="Pilih jenis pasien (BPJS / UMUM)"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="1">Pasien BPJS</SelectItem>
                            <SelectItem value="0">Pasien UMUM</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/*<div className="my-4">*/}
            {/*    <Label htmlFor="identifierNumber">Nomor BPJS/NIK/RM</Label>*/}
            {/*    <div className="flex items-center gap-4">*/}
            {/*        <Input type="number" id="identifierNumber"*/}
            {/*               placeholder="Masukkan nomor BPJS/NIK/RM anda (Pilih salah satu)"/>*/}
            {/*        <Button variant="outline">Cari</Button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="flex justify-end">
                <Button disabled>Daftar</Button>
            </div>
        </form>
    )
}

export default NewPatientForm