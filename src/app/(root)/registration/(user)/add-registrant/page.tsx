"use client";
import Section from "@/components/ui/section";
import React from "react";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  return (
    <>
      <Heading headingLevel="h3" variant="page-title">
        Tambah Pendaftar
      </Heading>

      <div className="space-y-6">
        <Section>
          <Heading headingLevel="h5">Button</Heading>
          <div className="flex gap-4 flex-wrap">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        <Section>
          <Heading headingLevel="h5">Form Pendaftaran</Heading>
          <div className="text-gray-500">
            <p>
              Jika pasien belum memiliki riwayat rekam medis, tambahkan pasien
              baru di{" "}
              <Link
                className="text-primary italic underline-offset-4 hover:underline"
                href="javascript:void(0)"
              >
                link ini
              </Link>
              . Kemudian, kembali ke halaman ini untuk mendaftarkan pasien ke
              poliklinik.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {/* <div className="my-4">
              <Label htmlFor="text">Input</Label>
              <Input type="text" id="text" placeholder="Email" />
            </div> */}
            <div className="my-4">
              <Label htmlFor="select">Poliklinik</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="my-4">
              <Label htmlFor="select">Dokter</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="select">Jenis Pasien</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="select">Jenis Kunjungan</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="my-4">
            <Label htmlFor="select">Nomor RM/BPJS/NIK</Label>
            <div className="flex items-center gap-4">
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant="outline">Cari</Button>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Home;
