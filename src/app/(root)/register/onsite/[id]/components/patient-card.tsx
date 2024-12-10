import Section from '@/components/ui/section';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PatientType } from '@/types/patient';
import { formatToStandardDate } from '@/utils/date-formatter';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface PatientCardProps {
    patient: PatientType | null;
}

const PatientCard = ({ patient }: PatientCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const combinedRef = cardRef;

    const reactToPrintFn = useReactToPrint({
        contentRef: cardRef,
    });

    return (
        <Section>
            <div className="flex justify-between gap-4 flex-wrap">
                <Heading variant="section-title" headingLevel="h5">
                    Kartu Pasien
                </Heading>
                <Button size="sm" variant="ghost" onClick={() => reactToPrintFn()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak
                </Button>
            </div>
            <Separator className="mb-6" />
            <div className="shadow-md mx-auto w-max rounded-md overflow-hidden mb-4">
                <div className="patient-card" ref={combinedRef}>
                    <div className="card-name-wrapper">
                        <p className="card-name">PATIENT CARD</p>
                    </div>
                    <div className="patient-card-img"></div>
                    <div className="patient-card-overlay">
                        <div className="patient-card-top">
                            <Image
                                src="/images/logo-rs-white.png"
                                alt="Logo RSU UMM"
                                className="logo-rs"
                                width={54}
                                height={54}
                            />
                            <p className="patient-card-title">RUMAH SAKIT</p>
                            <p className="patient-card-second-title">UNIVERSITAS MUHAMMADIYAH MALANG</p>
                        </div>
                        <div className="patient-card-bottom-overlay">
                            <div className="bottom-content-wrapper">
                                <div className="left-content">
                                    <p className="patient-birth-date">
                                        Tgl. Lahir :{' '}
                                        <b>
                                            {patient?.tgl_lahir &&
                                                formatToStandardDate(patient?.tgl_lahir.toString().split('T')[0])}
                                        </b>
                                    </p>
                                    <p className="patient-birth-date">
                                        No. RM : <b>{patient?.kode_rm}</b>
                                    </p>
                                </div>
                                <div className="right-content">
                                    <p className="patient-name">{patient?.nama_pasien}</p>
                                    <p className="patient-address">{patient?.alamat_tinggal?.toLocaleLowerCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default PatientCard;
