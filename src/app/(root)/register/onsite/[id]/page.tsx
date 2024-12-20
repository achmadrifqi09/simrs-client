'use client';

import Heading from '@/components/ui/heading';
import PatientData from '@/app/(root)/register/onsite/[id]/components/patient/patient-data';
import GeneralRegisterData from '@/app/(root)/register/onsite/[id]/components/registration/general-register-data';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import SelectRegistrant from '@/app/(root)/register/onsite/[id]/components/registration/select-registrant';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next-nprogress-bar';
import { PatientType } from '@/types/patient';

type RegistrationDetailPrams = {
    id: string;
};

const RegistrationDetail = () => {
    const params = useParams<RegistrationDetailPrams>();
    const router = useRouter();
    const [selectRegistrantShow, setSelectRegistrantShow] = useState<boolean>(false);
    const [patient, setPatient] = useState<PatientType | null>(null);

    const handleBackToCounter = () => {
        const counterId = Cookies.get('LATEST_COUNTER_ID');
        if (counterId) {
            router.push(`/queue/admission-counter/${counterId}`);
        } else {
            toast({
                description: 'Anda tidak memiliki riwayat loket yang pernah dikunjungi',
            });
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                <Heading variant="page-title" headingLevel="h3">
                    Pendaftaran Pasien
                </Heading>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => router.push('/register/onsite/')}>
                        Kembali
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectRegistrantShow(true)}>
                        Pilih Pendaftar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBackToCounter()}>
                        Kembali ke Loket
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <PatientData setPatient={setPatient} />
                <GeneralRegisterData id={params.id} patient={patient} />
            </div>
            <SelectRegistrant
                selectRegistrantShow={selectRegistrantShow}
                setSelectRegistrantShow={setSelectRegistrantShow}
            />
        </>
    );
};

export default RegistrationDetail;
