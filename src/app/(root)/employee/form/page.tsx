"use client"

import Section from "@/components/ui/section"
import Stepper from "@/components/ui/stepper";
import {useState} from "react";
import {Step} from "@/types/stepper";
import EmployeeIdentity from "@/app/(root)/employee/form/components/employee-identity";
import {useForm} from "react-hook-form";
import {employeeValidation} from "@/validation-schema/employee";
import {zodResolver} from "@hookform/resolvers/zod";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import {Form} from "@/components/ui/form";
import ResidenceAddress from "@/app/(root)/employee/form/components/residence-address";
import OriginAddress from "@/app/(root)/employee/form/components/origin-address";
import Heading from "@/components/ui/heading";
import ContactPerson from "@/app/(root)/employee/form/components/contact-person";
import FamilyStatus from "@/app/(root)/employee/form/components/family-status";
import SupportingDocument from "@/app/(root)/employee/form/components/supporting-document";
import JobDetail from "@/app/(root)/employee/form/components/job-detail";

const steps: Step[] = [
    {step: 1, title: 'Data Diri'},
    {step: 2, title: 'Alamat Asal'},
    {step: 3, title: 'Alamat Tinggal'},
    {step: 4, title: 'Informasi Kontak'},
    {step: 5, title: 'Status Keluarga'},
    {step: 6, title: 'Dokumen Pendukung'},
    {step: 7, title: 'Detail pekerjaan'},
]

const UpdateOrCreateEmployee = () => {
    const [formStep, setFormStep] = useState<number>(1);

    const employeeForm = useForm<EmployeeForm>({
        resolver: zodResolver(employeeValidation),
        defaultValues: {
            id_pegawai: 0,
            no_reg: "",
            nip_pegawai: 0,
            nip_pns: 0,
            gelar_depan: "",
            gelar_belakang: "",
            nama_pegawai: "",
            id_ms_negara_asal: 0,
            id_ms_provinsi_asal: 0,
            id_ms_kota_asal: 0,
            id_ms_kecamatan_asal: 0,
            id_ms_desa_asal: 0,
            alamat_asal: "",
            kode_pos_asal: "",
            rt_asal: "",
            rw_asal: "",
            id_ms_negara_tinggal: 0,
            id_ms_provinsi_tinggal: 0,
            id_ms_kota_tinggal: 0,
            id_ms_kecamatan_tinggal: 0,
            id_ms_desa_tinggal: 0,
            alamat_tinggal: "",
            kode_pos_tinggal: "",
            rt_tinggal: "",
            rw_tinggal: "",
            tempat_lahir: "",
            tgl_lahir: new Date("1900-01-01"),
            id_jenis_kelamin: 0,
            id_ms_golongan_darah: 0,
            id_ms_status_kawin: 0,
            id_ms_agama: 0,
            id_ms_pendidikan: 0,
            id_ms_jenis_pegawai: 0,
            id_ms_status_pegawai: 0,
            id_ms_spesialis: 0,
            id_unit_induk: 0,
            id_pangkat: 0,
            id_jabatan: 0,
            id_unit_jabatan: 0,
            id_gaji: 0,
            pjs: 0,
            hp: "",
            email: "",
            no_npwp: "",
            no_ktp: "",
            foto: "",
            kode_arsip: "",
            id_finger: 0,
            kode_dpjp: "",
            tgl_masuk: new Date("1900-01-01"),
            tgl_keluar: new Date("1900-01-01"),
            status_pns: 0,
            status_aktif: 1,
            id_pelamar: 0,
        }
    })
    const {control} = employeeForm
    return (
        <>
            <Heading headingLevel="h4" variant="page-title">
                Formulir Pegawai
            </Heading>
            <Section className="pt-8">
                <Stepper steps={steps} activeStep={formStep} stepperChange={setFormStep}>
                    <Form {...employeeForm}>
                        <form>
                            {formStep === 1 && (
                                <EmployeeIdentity control={control}/>
                            )}
                            {formStep === 2 && (
                                <ResidenceAddress control={control}/>
                            )}
                            {formStep === 3 && (
                                <OriginAddress control={control}/>
                            )}
                            {formStep === 4 && (
                                <ContactPerson control={control}/>
                            )}
                            {formStep === 5 && (
                                <FamilyStatus control={control}/>
                            )}
                            {formStep === 6 && (
                                <SupportingDocument control={control}/>
                            )}
                            {formStep === 7 && (
                                <JobDetail control={control}/>
                            )}
                        </form>
                    </Form>
                </Stepper>
            </Section>
        </>
    )
}

export default UpdateOrCreateEmployee
