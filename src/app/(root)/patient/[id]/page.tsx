"use client"
import {Form} from "@/components/ui/form";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {patientValidation} from "@/validation-schema/patient";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {usePatch} from "@/hooks/use-patch";
import {PatientType} from "@/types/patient";
import {PatientDTO} from "@/types/pasienDTO";
import useGet from "@/hooks/use-get";
import {useParams, useRouter} from "next/navigation";
import FormError from "@/components/ui/form-error";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {patient} from "@/const/patient-default-value";
import PersonalData from "@/app/(root)/patient/[id]/forms/personal-data";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import OriginAddress from "@/app/(root)/patient/[id]/forms/origin-address";
import PatientIdentity from "@/app/(root)/patient/[id]/forms/patient-identity";
import ResidenceAddress from "@/app/(root)/patient/[id]/forms/residence-address";

type PatientUpdateParams = {
    id: string;
}

const DoctorPatient = () => {
    const router = useRouter();
    const param = useParams<PatientUpdateParams>()
    const {data, loading} = useGet<PatientDTO>({
        url: `/patient/${param.id}`,
    });
    const patientForm = useForm<PatientType>({
        resolver: zodResolver(patientValidation),
        defaultValues: patient,
    });
    const {data: session} = useSession();
    const {control, handleSubmit} = patientForm
    const {updateData, patchError, patchLoading} = usePatch()

    const onSubmit = handleSubmit(async (values) => {
        try {
            if (!session?.accessToken) {
                return;
            }

            const [year, month, day] = values.tgl_lahir.toISOString().split('T')[0].split('-')
            const response = await updateData(
                `/patient/${param.id}`,
                {
                    ...values,
                    id_ms_kota_asal: values.id_ms_kota_asal,
                    tgl_lahir: `${day}-${month}-${year}`,
                    alamatgab_asal: `${values.alamat_asal.toString()}, ${values.rt_asal.toString()}, 
                    ${values.rw_asal.toString()}`,
                    alamatgab_tinggal: `${values.alamat_tinggal.toString()}, ${values.rt_tinggal.toString()}, 
                    ${values.rw_tinggal.toString()}`,
                }
            )

            if (response?.data) {
                toast({
                    title: "Aksi Berhasil",
                    description: 'Berhasil Memperbarui data pasien',
                })
                router.push(`/patient/`)
                patientForm.reset({})
            }
        } catch (error) {
            toast({
                title: "Gagal",
                description: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui data',
                variant: "destructive"
            })
        }
    });
    useEffect(() => {
        if (data) {
            patientForm.reset(data)
        }
    }, [data])
    return (
        <>
            <Heading variant="page-title" headingLevel="h3" className="mb-4">Update Data Pasien</Heading>
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
                                    errors={patchError}
                                />

                                <div className="flex justify-end mt-6 gap-2">
                                    <Button variant='outline' type="button"
                                            onClick={() => window.history.back()}>Kembali</Button>
                                    {
                                        loading ? (
                                            <Skeleton className="w-32 h-10"/>
                                        ) : (
                                            <Button type="submit" disabled={patchLoading}>
                                                {
                                                    (patchLoading) ? (
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

export default DoctorPatient
