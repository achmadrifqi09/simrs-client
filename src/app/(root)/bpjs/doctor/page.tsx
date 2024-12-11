'use client';
import Heading from '@/components/ui/heading';
import DoctorBPJS from './component/doctor-bpjs';
import DoctorInternal from './component/doctor-internal';
import { useState } from 'react';
import { InternalDoctors } from '@/types/doctor-bpjs';

const DoctorBPJSPage = () => {
    const [internalDoctors, setInternalDoctors] = useState<InternalDoctors | null>(null);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">
                Dokter BPJS
            </Heading>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                <DoctorBPJS internalDoctors={internalDoctors} />
                <DoctorInternal setDoctorInternal={setInternalDoctors} internalDoctors={internalDoctors} />
            </div>
        </>
    );
};

export default DoctorBPJSPage;

