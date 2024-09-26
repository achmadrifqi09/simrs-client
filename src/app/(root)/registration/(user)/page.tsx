"use client";
import Section from "@/components/ui/section";
import React from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import BpjsTable from "@/app/(root)/registration/(user)/bpjs-table";
import UmumTable from "@/app/(root)/registration/(user)/umum-table";
import { PatientType } from "@/types/patient";

const Registration = () => {
  const dataBPJS: PatientType[] = [
    {
      no: 1,
      kode_rm: "1968189",
      no_antrean: "B-1",
      kode_booking: "24090901",
      nama: "ARYA KHRISNA SATIRA WARDHANA",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 2,
      kode_rm: "1968188",
      no_antrean: "B-2",
      kode_booking: "24090902",
      nama: "MUHAMMAD ARIBY ZAHRON",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
    {
      no: 3,
      kode_rm: "1968189",
      no_antrean: "B-3",
      kode_booking: "24090901",
      nama: "ARYA KHRISNA SATIRA WARDHANA",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 4,
      kode_rm: "1968188",
      no_antrean: "B-4",
      kode_booking: "24090902",
      nama: "MUHAMMAD ARIBY ZAHRON",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
  ];

  const dataUmum: PatientType[] = [
    {
      no: 1,
      kode_rm: "1968181",
      no_antrean: "C-1",
      kode_booking: "24090901",
      nama: "INDAH DYASWATI HANANY",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 2,
      kode_rm: "1968122",
      no_antrean: "C-2",
      kode_booking: "24090902",
      nama: "Hanif Rahmannur Rosyid",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
    {
      no: 3,
      kode_rm: "1968181",
      no_antrean: "C-3",
      kode_booking: "24090901",
      nama: "INDAH DYASWATI HANANY",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 4,
      kode_rm: "1968122",
      no_antrean: "C-4",
      kode_booking: "24090902",
      nama: "Hanif Rahmannur Rosyid",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between mb-2">
        <Heading headingLevel="h3" variant="page-title">
          Pendaftaran
        </Heading>
        <Button variant="outline">
          <Link href="/registration/add-registrant">
            <span>Tambah Pendaftar</span>
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Section>
          <Heading headingLevel="h5">Pendaftar Layanan</Heading>
          <div className="flex-1 overflow-auto mt-4">
            <Tabs defaultValue="BPJS">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="BPJS">Pasien BPJS</TabsTrigger>
                <TabsTrigger value="Umum">Pasien Umum</TabsTrigger>
              </TabsList>
              <div className="my-4">
                <div className="my-3 flex justify-end">
                  <Input className="max-w-72" placeholder="Cari pasien..." />
                </div>
              </div>
              <TabsContent value="BPJS" className="px-2">
                <BpjsTable dataBPJS={dataBPJS} />
              </TabsContent>
              <TabsContent value="Umum" className="px-2">
                <UmumTable dataUmum={dataUmum} />
              </TabsContent>
            </Tabs>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Registration;
