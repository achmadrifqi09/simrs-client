import Section from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { useRef } from 'react';
import { Registration } from '@/types/register';
import { formatToStandardDate, timeStringFormatter } from '@/utils/date-formatter';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Separator } from '@/components/ui/separator';

interface PolyclinicTicketProps {
    data: Registration | null;
}

const PolyclinicTicket = ({ data }: PolyclinicTicketProps) => {
    const ticketRef = useRef<HTMLDivElement>(null);
    const combinedRef = ticketRef;

    const reactToPrintFn = useReactToPrint({
        contentRef: ticketRef,
    });

    return (
        <Section className="overflow-hidden">
            <div className="overflow-x-auto">
                <div className="flex justify-center items-center xl:justify-between mb-6 xl:mb-0 gap-4 xl:flex-row flex-col min-w-[302px]">
                    <Heading variant="section-title" className="mb-0 xl:mb-4" headingLevel="h5">
                        Nomor Antrean Poliklinik
                    </Heading>
                    <Button size="sm" variant="ghost" onClick={() => reactToPrintFn()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Cetak
                    </Button>
                </div>
                <Separator className="mb-6" />
                <div ref={combinedRef} className="w-[302px] mx-auto mb-2 ticket">
                    <p className="title font-semibold text-lg text-center">Faskes Tingkat Lanjut</p>
                    <p className="title font-semibold text-lg text-center">RSU Universitas Muhammadiyah Malang</p>
                    <p className="mt-4 text-center">
                        {data?.modified_at ? formatToStandardDate(data?.modified_at?.toString()?.split('T')[0]) : '-'}
                        {' - '}
                        {data?.modified_at && timeStringFormatter(data?.modified_at.toString())}
                    </p>
                    <p className="text-center mb-2">{data?.antrian.nama_pasien}</p>
                    <hr />
                    <div className="content my-6 text-center">
                        <p className="queue-number font-bold text-5xl mb-2">
                            {data?.kode_antrian_poli}-{data?.nomor_antrian_poli}
                        </p>
                        <p className="bold">Antrean Poliklinik</p>
                    </div>
                    <hr />
                    <p className="unit my-4 text-center">
                        {data?.antrian?.jadwal_dokter?.unit?.nama_unit_kerja} -{' '}
                        {data?.antrian?.jadwal_dokter?.pegawai?.gelar_depan}
                        {'. '}
                        {data?.antrian?.jadwal_dokter?.pegawai?.nama_pegawai}{' '}
                        {data?.antrian?.jadwal_dokter?.pegawai?.gelar_belakang}
                    </p>
                    <small className="notes text-center block">
                        Nomor antrean dapat digunakan pada tanggal
                        <b>
                            {' '}
                            {data?.tgl_daftar && formatToStandardDate(data?.tgl_daftar.toString().split('T')[0])}
                        </b>{' '}
                        jam{' '}
                        <b>
                            {data?.antrian?.jadwal_dokter?.jam_buka_praktek
                                ? timeStringFormatter(data?.antrian?.jadwal_dokter?.jam_buka_praktek.toString())
                                : 'Jam tidak valid'}
                            {' - '}
                            {data?.antrian?.jadwal_dokter?.jam_tutup_praktek
                                ? timeStringFormatter(data?.antrian?.jadwal_dokter?.jam_tutup_praktek.toString())
                                : 'Jam tidak valid'}
                        </b>
                    </small>
                </div>
            </div>
        </Section>
    );
};

export default PolyclinicTicket;
