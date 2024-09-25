"use client"
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import React from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const ReprintTicket = () => {
    const handleBackButton = () => {
        if (history) history.back()
    }

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                    Kembail
                </Button>
                <div>
                    <Heading headingLevel="h4" variant="section-title" className="text-center mb-1">
                        Cetak Ulang Tiket Antrean</Heading>
                </div>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto mt-4">
                <div className="mt-10">
                    <p className="italic text-gray-500"><span className="text-primary">**</span> Pastikan anda telah mengambil tiket antrean</p>
                    <form >
                        <div className="my-4">
                            <Label htmlFor="identifierNumber">Nomor BPJS/NIK/RM</Label>
                            <div className="flex items-center gap-4">
                                <Input type="number" id="identifierNumber"
                                       placeholder="Masukkan nomor BPJS/NIK/RM anda (Pilih salah satu)"/>
                                <Button variant="outline">Cari</Button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ReprintTicket