"use client"

import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import React from "react";
import Profile from "@/app/(root)/employee/profile/components/profile";
import Family from "@/app/(root)/employee/profile/components/family";

const EmployeeProfile = () => {
    return (
        <>
            <Heading variant="page-title" headingLevel="h3">Profile</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                <Section className="">
                    <div className="flex justify-center w-full">
                        <div
                            className="h-28 w-28 aspect-square bg-red-600 rounded-full font-medium flex select-none
                            items-center justify-center">
                        </div>
                    </div>
                    <div className="mt-2 text-center mb-2">
                        <p>Rakha Pradana</p>
                        <p>Non-Spesialis</p>
                    </div>
                    <div className="flex flex-col mt-8 gap-4">
                        <div className="flex justify-between w-full">
                            <p>NIP</p>
                            <p>202010380311038</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Jenis Kelamin</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Tempat Lahir</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Tanggal Lahir</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Agama</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>No.HP</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Email</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mt-4 w-full">
                        <Button>Edit</Button>
                        <Button variant='outline' onClick={() => window.history.back()}>Kembali</Button>
                    </div>
                </Section>

                <Section className="2xl:col-span-2">
                    <div className="">
                        <Tabs defaultValue="profile">
                            <TabsList className="grid w-full grid-cols-7">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="family">Keluarga</TabsTrigger>
                                <TabsTrigger value="education">Pendidikan</TabsTrigger>
                                <TabsTrigger value="course">Pelatihan</TabsTrigger>
                                <TabsTrigger value="job">Pekerjaan</TabsTrigger>
                                <TabsTrigger value="achievement">Prestasi</TabsTrigger>
                                <TabsTrigger value="assignmentLetter">Surat Tugas</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile" className="px-2">
                                <Profile/>
                            </TabsContent>
                            <TabsContent value="family" className="px-2">
                                <Family/>
                            </TabsContent>
                            <TabsContent value="education" className="px-2">
                            </TabsContent>
                            <TabsContent value="course" className="px-2">
                            </TabsContent>
                            <TabsContent value="job" className="px-2">
                            </TabsContent>
                            <TabsContent value="achivement" className="px-2">
                            </TabsContent>
                            <TabsContent value="assignmentLetter" className="px-2">
                            </TabsContent>

                        </Tabs>
                    </div>
                </Section>
            </div>

        </>
    )
}

export default EmployeeProfile
