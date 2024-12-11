"use client"

import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import React, {useEffect, useState} from "react";
import Profile from "@/app/(root)/employee/profile/components/profile";
import Family from "@/app/(root)/employee/profile/components/family";
import {useSearchParams} from "next/navigation";
import useGet from "@/hooks/use-get";
import {Employee} from "@/types/employee";
import {LuChevronDown} from "react-icons/lu";
import Education from "@/app/(root)/employee/profile/components/education";
import Course from "@/app/(root)/employee/profile/components/course";
import Job from "@/app/(root)/employee/profile/components/job";
import Achievement from "@/app/(root)/employee/profile/components/achievement";
import AssignmentLetter from "@/app/(root)/employee/profile/components/assignmentLetter";
import Image from 'next/image';
import useFile from "@/hooks/use-file";
import Link from "next/link";

const EmployeeProfile = () => {
    const {fetchFile} = useFile();
    const [photo, setPhoto] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const id_pegawai = Number(searchParams.get('id'));
    const {data} = useGet<Employee>({
        url: `/employee/${id_pegawai}`,
    });
    const [selectedTab, setSelectedTab] = useState<keyof typeof menuItems>("profile");
    const menuItems = {
        profile: "Profile",
        family: "Keluarga",
        education: "Pendidikan",
        course: "Pelatihan",
        job: "Pekerjaan",
        achievement: "Prestasi",
        assignmentLetter: "Surat Tugas",
    };

    const handleDropdownChange = (value: keyof typeof menuItems) => {
        setSelectedTab(value);
    };

    const handleSImage = async (pathname: string) => {
        const image = await fetchFile(pathname);
        const photoProfile = URL.createObjectURL(new Blob([image]))
        setPhoto(photoProfile)
    }

    useEffect(() => {
        if (data) {
            handleSImage(`/employee/${id_pegawai}/foto`)
        }
    }, [data])

    return (
        <>
            <Heading variant="page-title" headingLevel="h3">Profile</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                <Section>
                    <div className="flex justify-center w-full">
                        <div
                            className="h-28 w-28 aspect-square bg-red-600 rounded-full font-medium flex select-none
                            items-center justify-center">
                            {
                                photo && (
                                    <Image
                                        src={photo}
                                        alt="Employee Photo"
                                        width={200}
                                        height={200}
                                        className="h-28 w-28 aspect-square bg-red-600 rounded-full font-medium flex select-none
                            items-center justify-center object-cover object-top"/>
                                )
                            }
                        </div>
                    </div>
                    <div className="mt-2 text-center mb-2">
                        <p>{data?.nama_pegawai}</p>
                        <p>{data?.id_ms_spesialis}</p>
                    </div>
                    <div className="flex flex-col mt-8 gap-4">
                        <div className="flex justify-between w-full">
                            <p>NIP</p>
                            <p>{data?.nip_pegawai}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Jenis Kelamin</p>
                            <p>{data?.id_jenis_kelamin === 1 ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Tempat Lahir</p>
                            <p>{data?.tempat_lahir}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Tanggal Lahir</p>
                            <p>{data?.tgl_lahir.split('T')[0]}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Agama</p>
                            <p>{data?.id_ms_agama}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>No.HP</p>
                            <p>{data?.hp}</p>
                        </div>
                        <div className="flex justify-between w-full">
                            <p>Email</p>
                            <p>{data?.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4 w-full">
                        <Button>
                            <Link href={`/employee/form?id=${id_pegawai}`}>
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={() => window.history.back()}>Kembali</Button>
                    </div>
                </Section>

                <Section className="2xl:col-span-2">
                    <DropdownMenu>
                        <div className="flex gap-2 items-center text-white">
                            <DropdownMenuTrigger className="w-1/4">
                                <Button className="w-full flex items-center justify-between">
                                    {menuItems[selectedTab]}
                                    <LuChevronDown/>
                                </Button>
                            </DropdownMenuTrigger>
                        </div>
                        <DropdownMenuContent className="w-56">
                            {Object.keys(menuItems).map((key) => (
                                <DropdownMenuItem key={key}
                                                  onClick={() => handleDropdownChange(key as keyof typeof menuItems)}>
                                    {menuItems[key as keyof typeof menuItems]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dynamic content based on selected tab */}
                    <div className="px-2 mt-4 w-full">
                        {selectedTab === "profile" && <Profile/>}
                        {selectedTab === "family" && <Family/>}
                        {selectedTab === "education" && <Education/>}
                        {selectedTab === "course" && <Course/>}
                        {selectedTab === "job" && <Job/>}
                        {selectedTab === "achievement" && <Achievement/>}
                        {selectedTab === "assignmentLetter" && <AssignmentLetter/>}
                    </div>
                </Section>
            </div>
        </>
    );
}

export default EmployeeProfile;
