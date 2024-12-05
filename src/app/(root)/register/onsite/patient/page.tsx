"use client"
import {Form} from "@/components/ui/form";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {PatientType} from "@/types/patient";
import {PatientDTO} from "@/types/pasienDTO";
import useGet from "@/hooks/use-get";
import {useRouter, useSearchParams} from "next/navigation";
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {patient} from "@/const/patient-default-value";
import PersonalData from "@/app/(root)/register/onsite/patient/forms/personal-data";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import OriginAddress from "@/app/(root)/register/onsite/patient/forms/origin-address";
import PatientIdentity from "@/app/(root)/register/onsite/patient/forms/patient-identity";
import ResidenceAddress from "@/app/(root)/register/onsite/patient/forms/residence-address";
import {usePost} from "@/hooks/use-post";
import {zodResolver} from "@hookform/resolvers/zod";
import {patientValidation} from "@/validation-schema/patient";

const PatientRegister = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const QUID = Number(searchParams.get('QUID'));
    const {data, loading} = useGet<PatientDTO>({
        url: `/queue/QUID/${QUID}`,
    });
    const patientForm = useForm<PatientType>({
        resolver: zodResolver(patientValidation),
        defaultValues: patient,
    });
    const {data: session} = useSession();
    const {postData, postLoading, postError} = usePost(`/patient/QUID/${QUID}`)
    const {control, handleSubmit} = patientForm
    const onSubmit = handleSubmit(async (values) => {
        try {
            if (!session?.accessToken) {
                return;
            }

            const [year, month, day] = values.tgl_lahir.toISOString().split('T')[0].split('-');
            const response = await postData(
                {
                    ...values,
                    id_ms_kota_asal: values.id_ms_kota_asal,
                    tgl_lahir: `${day}-${month}-${year}`,
                    jenis_kelamin: values.jenis_kelamin,
                    identitas_pasien: Number(values.identitas_pasien),
                    alamatgab_asal: `${values.alamat_asal.toString()}, ${values.rt_asal.toString()},
                ${values.rw_asal.toString()}`,
                    alamatgab_tinggal: `${values.alamat_tinggal.toString()}, ${values.rt_tinggal.toString()},
                ${values.rw_tinggal.toString()}`,
                }
            );
            console.log(values.jenis_kelamin);
            if (response?.data) {
                toast({
                    title: "Aksi Berhasil",
                    description: 'Berhasil Menambahkan data pasien',
                });
                router.push(`/register/onsite/`);
                patientForm.reset({});
            }
        } catch (error) {
            toast({
                title: "Gagal",
                description: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui data',
                variant: "destructive"
            });
        }
    });

    useEffect(() => {
        if (data) {
            patientForm.reset(data)
        }
    }, [data])
    return (
        <>
            <Heading variant="page-title" headingLevel="h3" className="mb-4">Update Data Pasien Pendaftaran</Heading>
            {
                loading ? (
                    <Section>
                        <Skeleton className="h-5 w-40 mb-4 rounded"/>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
                            {
                                Array.from({length: 10}, (_, index) => (
                                    <div key={index}>
                                        <Skeleton className="h-4 w-32 mb-1.5 rounded"/>
                                        <Skeleton className="h-10 w-full rounded"/>
                                    </div>
                                ))
                            }
                        </div>
                    </Section>
                ) : (
                    <Section>
                        <Form {...patientForm}>
                            <form onSubmit={onSubmit}>
                                <PersonalData control={control}/>
                                <PatientIdentity control={control}/>
                                <OriginAddress control={control}/>
                                <ResidenceAddress control={control}/>
                                <FormError
                                    errors={postError}
                                />

                                <div className="flex justify-end mt-6 gap-2">
                                    <Button variant='outline' type="button"
                                            onClick={() => window.history.back()}>Kembali</Button>
                                    {
                                        loading ? (
                                            <Skeleton className="w-32 h-10"/>
                                        ) : (
                                            <Button type="submit" disabled={postLoading}>
                                                {
                                                    (postLoading) ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                            <span>Loading</span>
                                                        </>
                                                    ) : (
                                                        <span>Simpan</span>
                                                    )
                                                }
                                            </Button>
                                        )
                                    }
                                </div>
                            </form>
                        </Form>
                    </Section>
                )
            }
        </>
    )
}

export default PatientRegister
