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
import {EmployeeSingle, EmployeeSubmitPayload} from "@/types/employee";
import {Form} from "@/components/ui/form";
import {useRouter, useSearchParams} from "next/navigation";
import useGet from "@/hooks/use-get";
import {employeeValidationSchema} from "@/validation-schema/employee";
import {zodResolver} from "@hookform/resolvers/zod";

const steps: Step[] = [
    {step: 1, title: "Data Diri"},
    {step: 2, title: "Alamat Asal"},
    {step: 3, title: "Alamat Tinggal"},
    {step: 4, title: "Dokumen Pendukung"},
    {step: 5, title: "Detail pekerjaan"},
];

const UpdateOrCreateEmployee = () => {
    const router = useRouter();
    const {data: session} = useSession();
    const [formStep, setFormStep] = useState<number>(1);
    const {postData} = usePost("/employee");
    const {updateData} = usePatch();
    const {status} = useSession();
    const employeeForm = useForm<EmployeeForm>({
        resolver: zodResolver(employeeValidationSchema),
        defaultValues: employee,
    });

    const searchParams = useSearchParams();
    const id_pegawai = Number(searchParams.get('id'));

    const {data} = useGet<EmployeeSingle>({
        url: id_pegawai ? `/employee/${id_pegawai}` : '/employee',
    });


    const {handleSubmit, control, setValue} = employeeForm;
    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');
    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }
        const formData = new FormData();
        const fileKeys = ["file_ktp", "file_kk", "file_ktam", "file_npwp", "foto"];
        files.forEach((file, index) => {
            if (file) {
                formData.append(fileKeys[index], file);
            }
        });


        const payload: EmployeeSubmitPayload = {
            ...values,
            nip_pegawai: String(values.nip_pegawai),
            id_ms_negara_asal: values.id_ms_negara_asal || undefined,
            id_ms_provinsi_asal: values.id_ms_provinsi_asal ? String(values.id_ms_provinsi_asal) : undefined,
            id_ms_kota_asal: values.id_ms_kota_asal ? String(values.id_ms_kota_asal) : undefined,
            id_ms_kecamatan_asal: values.id_ms_kecamatan_asal ? String(values.id_ms_kecamatan_asal) : undefined,
            id_ms_desa_asal: values.id_ms_desa_asal ? String(values.id_ms_desa_asal) : undefined,
            alamat_asal: values.alamat_asal || undefined,
            kode_pos_asal: values.kode_pos_asal || undefined,
            rt_asal: values.rt_asal || undefined,
            rw_asal: values.rw_asal || undefined,
            id_ms_kota_tinggal: String(values.id_ms_kota_tinggal),
            id_ms_kecamatan_tinggal: String(values.id_ms_kecamatan_tinggal),
            id_ms_desa_tinggal: String(values.id_ms_desa_tinggal),
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
            email: String(values.email),
            no_ktp: values.no_ktp || "",
            status_pns: Number(values.status_pns),
            status_aktif: Number(values.status_aktif),
            tgl_lahir: submitMode === 'PATCH' && values.tgl_lahir
                ? dateFormatter(new Date(values.tgl_lahir.split('T')[0]))
                : (values.tgl_lahir ? dateFormatter(new Date(values.tgl_lahir)) : ""),
            tgl_masuk: submitMode === 'PATCH' && values.tgl_masuk
                ? dateFormatter(new Date(values.tgl_masuk.split('T')[0]))
                : (values.tgl_masuk ? dateFormatter(new Date(values.tgl_masuk)) : ""),
            tgl_keluar: values.tgl_keluar && !isNaN(new Date(values.tgl_keluar).getTime())
                ? dateFormatter(new Date(values.tgl_keluar))
                : null,
            foto: files[4] ? files[4] : undefined,
            file_ktp: files[0] ? files[0] : undefined,
            file_kk: files[1] ? files[1] : undefined,
            file_ktam: files[2] ? files[2] : undefined,
            file_npwp: files[3] ? files[3] : undefined,
            id_ms_pendidikan: Number(values.id_ms_pendidikan),
            id_ms_status_pegawai: Number(values.id_ms_status_pegawai),
            id_ms_spesialis: Number(values.id_ms_spesialis),
            id_pangkat: Number(values.id_pangkat),
            id_jabatan: Number(values.id_jabatan),
            kode_dpjp: values.kode_dpjp || null,
            id_ms_jenis_pegawai: values.id_ms_jenis_pegawai ? Number(values.id_ms_jenis_pegawai) : 0,
            id_ms_unit_induk: Number(values.id_unit_induk),
            id_ms_unit_kerja: Number(values.id_unit_kerja),
            nip_pns: (() => {return values.nip_pns && values.nip_pns !== "null" ? values.nip_pns : null;})(),
            gelar_depan: values.gelar_depan || null,
            gelar_belakang: values.gelar_belakang || null
        };
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, String(value));
            }
        });

        let response;
        if (submitMode === 'POST') {
            response = await postData(formData);
        } else if (submitMode === 'PATCH') {
            response = await updateData(`/employee/${id_pegawai}`, payload);
        }

        if (response?.data) {
            toast({
                title: "Aksi Berhasil",
                description: submitMode === 'PATCH'
                    ? `Berhasil memperbarui data Pegawai ${response?.data?.nama_pegawai}`
                    : "Berhasil menambah data",
            });
            router.push(`/employee/`);
            employeeForm.reset();
        }
    });

    const initialFiles = id_pegawai
        ? [
            employee.file_ktp,
            employee.file_kk,
            employee.file_ktam,
            employee.file_npwp,
            employee.foto
        ]
        : undefined;

    useEffect(() => {
        if (id_pegawai && data) {
            setSubmitMode('PATCH');
            setValue('nip_pegawai', data.nip_pegawai);
            setValue('nip_pns', data.nip_pns || null);
            setValue('gelar_depan', data.gelar_depan ||null);
            setValue('gelar_belakang', data.gelar_belakang||null);
            setValue('nama_pegawai', data.nama_pegawai);
            setValue('id_ms_negara_tinggal', data.id_ms_negara_tinggal);
            setValue('id_ms_provinsi_tinggal', data.id_ms_provinsi_tinggal);
            setValue('id_ms_kota_tinggal', data.id_ms_kota_tinggal);
            setValue('id_ms_kecamatan_tinggal', data.id_ms_kecamatan_tinggal);
            setValue('id_ms_desa_tinggal', data.id_ms_desa_tinggal);
            setValue('alamat_tinggal', data.alamat_tinggal);
            setValue('kode_pos_tinggal', data.kode_pos_tinggal);
            setValue('rt_tinggal', data.rt_tinggal);
            setValue('rw_tinggal', data.rw_tinggal);
            setValue('id_ms_negara_asal', data.id_ms_negara_asal);
            setValue('id_ms_provinsi_asal', data.id_ms_provinsi_asal);
            setValue('id_ms_kota_asal', data.id_ms_kota_asal);
            setValue('id_ms_kecamatan_asal', data.id_ms_kecamatan_asal);
            setValue('id_ms_desa_asal', data.id_ms_desa_asal);
            setValue('alamat_asal', data.alamat_asal);
            setValue('kode_pos_asal', data.kode_pos_asal);
            setValue('rt_asal', data.rt_asal);
            setValue('rw_asal', data.rw_tinggal);
            setValue('tempat_lahir', data.tempat_lahir);
            setValue('id_jenis_kelamin', data.id_jenis_kelamin);
            setValue('id_ms_golongan_darah', data.id_ms_golongan_darah);
            setValue('id_ms_status_kawin', data.id_ms_status_kawin);
            setValue('id_ms_agama', data.id_ms_agama);
            setValue('hp', data.hp);
            setValue('email', data.email);
            setValue('no_ktp', data.no_ktp || "");
            setValue('status_pns', Number(data.status_pns));
            setValue('status_aktif', Number(data.status_aktif));
            setValue('tgl_lahir', data.tgl_lahir);
            setValue('tgl_masuk', data.tgl_masuk);
            setValue('tgl_keluar', String(data.tgl_keluar));
            setValue('id_ms_pendidikan', data.id_ms_pendidikan);
            setValue('status_aktif', Number(data.status_aktif));
            setValue('id_ms_spesialis', data.id_ms_spesialis)
            setValue('id_ms_status_pegawai', data.id_ms_status_pegawai);
            setValue('id_pangkat', data.id_pangkat)
            setValue('id_jabatan', data.id_jabatan)
            setValue('kode_dpjp', data.kode_dpjp)
            setValue('id_unit_induk', Number(data.id_unit_induk));
            setValue('id_unit_kerja', Number(data.id_unit_kerja));
            setValue('id_ms_jenis_pegawai', Number(data.id_ms_jenis_pegawai))
        } else {
            setSubmitMode('POST');
        }

    }, [id_pegawai, data, setValue]);
    console.log('Form values:', employeeForm.getValues());
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
                                    {formStep === 4 && submitMode === 'POST' && (
                                        <SupportingDocument
                                            control={control}
                                            setFiles={setFiles}
                                            initialFiles={initialFiles}
                                        />
                                    )}
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
