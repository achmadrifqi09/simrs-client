"use client";

import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import PatientData from "@/app/(root)/register/onsite/[id]/components/patient-data";
import GeneralRegisterData from "@/app/(root)/register/onsite/[id]/components/general-register-data";
import { Button } from "@/components/ui/button";

const RegistrationDetail = () => {

    return (
        <>
            <Heading variant='page-title' headingLevel='h3'> Detail Register</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                <Section>
                    <div>
                        <Heading variant="section-title" headingLevel="h5">Data Pasien</Heading>
                    </div>
                    <PatientData/>
                </Section>
                <Section className="2xl:col-span-2 flex flex-col justify-between h-full">
                    <div>
                        <GeneralRegisterData/>
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Button>Simpan</Button>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Kembali
                        </Button>
                    </div>
                </Section>
            </div>
        </>
    );
};

export default RegistrationDetail;
