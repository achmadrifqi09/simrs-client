import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import Section from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { PatientType } from '@/types/patient';
import { Printer } from 'lucide-react';
import { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatToStandardDate } from '@/utils/date-formatter';

interface PolyclinicLabelProps {
    patient: PatientType | null;
}

const PolyclinicLabel = ({ patient }: PolyclinicLabelProps) => {
    const [labelTotal, setLabelTotal] = useState<number>(1);
    const labelRef = useRef<HTMLDivElement>(null);
    const combinedRef = labelRef;

    const reactToPrintFn = useReactToPrint({
        contentRef: labelRef,
    });

    return (
        <Section>
            <div className="flex justify-between gap-4 flex-wrap">
                <Heading variant="section-title" headingLevel="h5">
                    Label Poliklinik
                </Heading>
                <div className="flex gap-2">
                    <Select defaultValue="1" onValueChange={(value) => setLabelTotal(Number(value))}>
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => reactToPrintFn()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Cetak
                    </Button>
                </div>
            </div>
            <Separator className="mb-6" />
            <div className="shadow w-max overflow-hidden rounded-md mx-auto border border-gray-100">
                <div className="mx-auto polyclinic-label-container" ref={combinedRef}>
                    {Array.from({ length: labelTotal }, (_, i: number) => {
                        return (
                            <div className="polyclinic-label" key={i}>
                                <div className="identifier-patient-wrapper">
                                    <div className="identifier-item">
                                        <p className="identifier-label">No RM</p>
                                        <p className="identifier-vaule">{patient?.kode_rm}</p>
                                    </div>
                                    <div className="identifier-item">
                                        <p className="identifier-label">Tgl Lahir</p>
                                        <p className="identifier-vaule">
                                            {patient?.tgl_lahir
                                                ? formatToStandardDate(
                                                      new Date(patient.tgl_lahir).toISOString().split('T')[0]
                                                  )
                                                : '-'}
                                        </p>
                                    </div>
                                    <div className="identifier-item">
                                        <p className="identifier-label">Jenis Kelamin</p>
                                        <p className="identifier-vaule">
                                            {' '}
                                            {patient?.jenis_kelamin == 1 ? 'Laki-Laki' : 'Perempuan'}
                                        </p>
                                    </div>
                                </div>
                                <p className="identifier-patient-name">An. {patient?.nama_pasien}</p>
                                <p className="polyclinic-label-address capitalize">{patient?.alamat_tinggal}</p>
                                <div className="polyclinic-label-footer">
                                    <div className="label-barcode-wrapper">
                                        <Barcode
                                            value={patient?.kode_rm || ''}
                                            width={0.5}
                                            height={16}
                                            displayValue={false}
                                        />
                                    </div>
                                    <p className="identifier-vaule">NIK {patient?.no_identitas}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};

export default PolyclinicLabel;
