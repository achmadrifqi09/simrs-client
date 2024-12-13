'use client';

import Registration from '@/app/(root)/register/onsite/[id]/components/registration';
import RegistrationFee from '@/app/(root)/register/onsite/[id]/components/registration-fee';
import Heading from '@/components/ui/heading';
import Section from '@/components/ui/section';
import useGet from '@/hooks/use-get';
import { Registration as RegistrationType } from '@/types/register';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import FormSubmitted from './form-submitted';
import RegistrationCard from './registration-card';
import PolyclinicTicket from './polyclinic-ticket';
import PatientCard from './patient-card';
import { PatientType } from '@/types/patient';
import { Separator } from '@/components/ui/separator';
import PolyclinicLabel from './polyclinic-label';

interface GeneralRegisterData {
    id: string;
    patient: PatientType | null;
}

const GeneralRegisterData = ({ id, patient }: GeneralRegisterData) => {
    const { data, getData } = useGet<RegistrationType>({ url: `/registration/${id}` });
    const [isSuccessRegister, setIsSuccessRegister] = useState<boolean>(false);
    const [isRegistrationFee, setIsRegistration] = useState<boolean>(false);

    const onRefresh = () => {
        if (!data?.modified_at || !data?.biaya_pendaftaran || data?.status_kirim_bpjs === 0) {
            getData().catch(() => {
                toast({
                    title: 'Terjadi Kesalahan',
                    description: 'Gagal mendapatkan data terbaru',
                });
            });
        }
    };

    useEffect(() => {
        if (data) {
            setIsSuccessRegister(() =>
                (data?.biaya_pendaftaran || isSuccessRegister) && data?.modified_at ? true : false
            );
        }
    }, [data]);

    return (
        <div className="xl:col-span-2 flex flex-col justify-between h-max space-y-6">
            <Section className="relative">
                <div className="flex justify-between items-center">
                    <Heading variant="section-title" headingLevel="h5">
                        Pendaftaran
                    </Heading>
                </div>
                <Separator className="mb-6" />
                {isSuccessRegister ? (
                    <RegistrationCard registration={data} patient={patient} onRefresh={onRefresh} />
                ) : (
                    <>
                        {data?.modified_at ? (
                            <FormSubmitted>
                                <p className="text-sm text-gray-600">Formulir pendaftaran telah terkirim</p>
                            </FormSubmitted>
                        ) : (
                            <Registration id={id} data={data} onRefresh={onRefresh} patient={patient} />
                        )}
                        <Separator className="my-6" />
                        {data?.biaya_pendaftaran?.created_at || isRegistrationFee ? (
                            <FormSubmitted>
                                <p>Formulir biaya telah terkirim</p>
                            </FormSubmitted>
                        ) : (
                            <RegistrationFee
                                id={Number(id)}
                                onRefresh={onRefresh}
                                setIsRegistrationFee={setIsRegistration}
                            />
                        )}
                    </>
                )}
            </Section>
            {isSuccessRegister && (
                <>
                    <PolyclinicTicket data={data} />
                    <PatientCard patient={patient} />
                    <PolyclinicLabel patient={patient} />
                </>
            )}
        </div>
    );
};

export default GeneralRegisterData;
