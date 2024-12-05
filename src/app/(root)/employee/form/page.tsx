"use client"
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import Section from "@/components/ui/section";
import Stepper from "@/components/ui/stepper";
import {Step} from "@/types/stepper";
import EmployeeIdentity from "@/app/(root)/employee/form/components/employee-identity";
import ResidenceAddress from "@/app/(root)/employee/form/components/residence-address";
import OriginAddress from "@/app/(root)/employee/form/components/origin-address";
import SupportingDocument from "@/app/(root)/employee/form/components/supporting-document";
import JobDetail from "@/app/(root)/employee/form/components/job-detail";
import Heading from "@/components/ui/heading";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {EmployeeForm} from "@/app/(root)/employee/form/form";
import {dateFormatter} from "@/utils/date-formatter";
import {employee} from "@/const/employee-default-value";
import {Employee} from "@/types/employee";
import {Form} from "@/components/ui/form";
import router from "next/router";

const steps: Step[] = [
    {step: 1, title: "Data Diri"},
    {step: 2, title: "Alamat Asal"},
    {step: 3, title: "Alamat Tinggal"},
    {step: 4, title: "Dokumen Pendukung"},
    {step: 5, title: "Detail pekerjaan"},
];

interface EmployeProps {
    onRefresh: () => void;
    selectedRecordId: string;
}

const UpdateOrCreateEmployee = ({
                                    onRefresh,
                                    selectedRecordId,
                                }: EmployeProps) => {
    const {data: session} = useSession();
    const [formStep, setFormStep] = useState<number>(1);
    const {postData} = usePost("/employee");
    const {updateData} = usePatch();

    const employeeForm = useForm<EmployeeForm>({
        defaultValues: employee,
    });

    const {handleSubmit, control} = employeeForm;

    const {status} = useSession()
    const [files] = useState<(File | null)[]>([null, null, null, null, null]);

    const onSubmit = handleSubmit(async (values) => {
        const formData = new FormData();
        if (files[0]) formData.append("ktp", files[0]);
        if (files[1]) formData.append("kk", files[1]);
        if (files[2]) formData.append("ktam", files[2]);
        if (files[3]) formData.append("npwp", files[3]);
        if (files[4]) formData.append("foto", files[4]);

        if (!session?.accessToken) {
            return;
        }

        const payload: Employee = {
            ...values,
            nip_pegawai: String(values.nip_pegawai),
            nip_pns: String(values.nip_pns),
            gelar_depan: String(values.gelar_depan),
            gelar_belakang: String(values.gelar_belakang),
            nama_pegawai: values.nama_pegawai,
            id_ms_negara_tinggal: Number(values.id_ms_negara_tinggal),
            id_ms_provinsi_tinggal: String(values.id_ms_provinsi_tinggal || ""),
            id_ms_kota_tinggal: String(values.id_ms_kota_tinggal || ""),
            id_ms_kecamatan_tinggal: String(values.id_ms_kecamatan_tinggal || ""),
            id_ms_desa_tinggal: String(values.id_ms_desa_tinggal || ""),
            alamat_tinggal: values.alamat_tinggal,
            kode_pos_tinggal: values.kode_pos_tinggal,
            rt_tinggal: values.rt_tinggal,
            rw_tinggal: values.rw_tinggal,
            tempat_lahir: values.tempat_lahir,
            id_jenis_kelamin: Number(values.id_jenis_kelamin),
            id_ms_golongan_darah: Number(values.id_ms_golongan_darah),
            id_ms_status_kawin: Number(values.id_ms_status_kawin),
            id_ms_agama: Number(values.id_ms_agama),
            hp: values.hp,
            email: values.email,
            no_ktp: values.no_ktp || "",
            status_pns: Number(values.status_pns),
            status_aktif: Number(values.status_aktif),
            tgl_lahir: values.tgl_lahir ? new Date(values.tgl_lahir) : new Date(),
            tgl_masuk: values.tgl_masuk ? new Date(values.tgl_masuk) : new Date(),
            tgl_keluar: values.tgl_keluar ? new Date(values.tgl_keluar) : new Date(),
            file_ktp: "",
            file_kk: "",
            file_ktam: "",
            file_npwp: "",
            id_pegawai:1
        };

        const formattedPayload = {
            ...payload,
            tgl_lahir: dateFormatter(payload.tgl_lahir),
            tgl_masuk: dateFormatter(payload.tgl_masuk),
            tgl_keluar: dateFormatter(payload.tgl_keluar),
        };

        Object.entries(formattedPayload).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        // formData.forEach((value, key) => {
        //     console.log(key + ": " + value);
        // });

        const response = selectedRecordId
            ? await updateData(`/employee/${selectedRecordId}`, formData)
            : await postData(formData);

        if (response?.data) {
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${selectedRecordId ? "memperbarui data" : "menambah data"}`,
            });
            router.push(`/employee/`)
            employeeForm.reset();
            onRefresh();
        }
    });

    useEffect(() => {
    }, []);

    return (
        <>
            <div className="flex justify-between items-center mb-0">
                <Heading headingLevel="h4" variant="page-title">
                    Formulir Pegawai
                </Heading>
                <Button variant="outline" onClick={() => window.history.back()}>
                    Kembali
                </Button>
            </div>
            <Section className="pt-8">
                {
                    status !== "loading" && (
                        <Form {...employeeForm}>
                            <form onSubmit={onSubmit}>
                                <Stepper
                                    steps={steps}
                                    activeStep={formStep}
                                    stepperChange={setFormStep}
                                    action={
                                        formStep === 5 && <Button type="submit">Simpan</Button>
                                    }
                                >
                                    {formStep === 1 && <EmployeeIdentity control={control}/>}
                                    {formStep === 2 && <ResidenceAddress control={control}/>}
                                    {formStep === 3 && <OriginAddress control={control}/>}
                                    {formStep === 4 && <SupportingDocument control={control}/>}
                                    {formStep === 5 && <JobDetail control={control}/>}
                                </Stepper>
                            </form>
                        </Form>
                    )
                }
            </Section>
        </>
    );
};

export default UpdateOrCreateEmployee;
