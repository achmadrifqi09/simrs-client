import { Registration } from '@/types/register';
import { formatToStandardDate, removeMillisecondsAndTimezone, timeStringFormatter } from '@/utils/date-formatter';
import { Button } from '@/components/ui/button';
import { BPJSQueueAdd } from '@/types/bpjs-queue';
import { PatientType } from '@/types/patient';
import { usePost } from '@/hooks/use-post';
import { lazy, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
const SEPDialog = lazy(() => import('../sep/sep-dialog'));
interface RegistrationCardProps {
    registration: Registration | null;
    patient: PatientType | null;
    onRefresh: () => void;
}

const RegistrationCard = ({ registration, patient, onRefresh }: RegistrationCardProps) => {
    const { postData, postLoading, postError } = usePost('/bpjs/queue');
    const [openDialogSEP, setOpenDialogSEP] = useState<boolean>(false);
    const splitDateGetHour = (date: Date) => {
        const stringDate = new Date(date).toISOString();
        return stringDate.split('T')[1];
    };

    const handleSendQueueToBPJS = async () => {
        if (registration && patient) {
            const payload: BPJSQueueAdd = {
                idantrian: Number(registration.antrian.id_antrian),
                idpendaftaran: Number(registration.id),
                jenispasien: Number(registration?.id_asuransi) === 1 ? 'JKN' : 'NON JKN',
                nomorkartu: Number(registration?.id_asuransi) === 1 ? patient.no_bpjs : undefined,
                nik: patient.no_identitas,
                nohp: patient.no_hp,
                kodepoli: registration?.antrian.jadwal_dokter.unit?.kode_instalasi_bpjs,
                namapoli: registration?.antrian.jadwal_dokter.unit.nama_unit_kerja,
                pasienbaru: Number(registration?.antrian?.jenis_pasien) === 2 ? 1 : 0,
                norm: patient?.kode_rm,
                tanggalperiksa:
                    registration?.tgl_daftar?.toString().split('T')[0] || new Date().toISOString().split('T')[0],
                kodedokter: Number(registration?.antrian?.jadwal_dokter?.pegawai?.kode_dpjp),
                namadokter: `${registration?.antrian?.jadwal_dokter?.pegawai?.gelar_depan} ${
                    registration?.antrian?.jadwal_dokter?.pegawai?.nama_pegawai
                } ${registration?.antrian?.jadwal_dokter?.pegawai?.gelar_belakang ?? ''}`,
                jampraktek: `${removeMillisecondsAndTimezone(
                    splitDateGetHour(registration?.antrian?.jadwal_dokter?.jam_buka_praktek)
                )}-${removeMillisecondsAndTimezone(
                    splitDateGetHour(registration?.antrian?.jadwal_dokter?.jam_tutup_praktek)
                )}`,
                jeniskunjungan: registration?.status_rujukan,
                nomorreferensi:
                    Number(registration?.status_rujukan) !== 1
                        ? registration?.nomor_rujuk_balik
                        : registration?.no_rujukan,
                nomorantrean: `${registration?.antrian.kode_antrian}-${registration?.antrian?.no_antrian}`,
                angkaantrean: registration?.antrian?.no_antrian,
            };
            const response = await postData(payload);
            if (response?.status_code === 201) {
                onRefresh();
                toast({
                    description: 'Berhasil mengirim antrean ke BPJS',
                });
            }
        }
    };

    useEffect(() => {
        if (postError) {
            toast({
                title: 'Terjadi kesalahan',
                description: postError?.toString(),
            });
        }
    }, [postError]);

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Instalasi</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center">
                        {registration?.antrian?.jadwal_dokter?.unit?.nama_unit_kerja}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Kartu Asuransi</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center">
                        {registration?.nomor_asuransi ?? '-'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center">
                        {registration?.tgl_daftar ? formatToStandardDate(registration?.tgl_daftar.split('T')[0]) : '-'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Jenis Pendaftaran</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center">
                        {registration?.status_bpjs === 2 ? 'BPJS' : 'Umum'}
                        {registration?.status_bpjs === 1 && (registration?.asuransi?.nama_asuransi || 'Non asuransi')}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Dokter</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.antrian?.jadwal_dokter?.pegawai?.gelar_depan?.toLocaleLowerCase()}
                        {'. '}
                        {registration?.antrian?.jadwal_dokter?.pegawai?.nama_pegawai?.toLocaleLowerCase()}{' '}
                        {registration?.antrian?.jadwal_dokter?.pegawai?.gelar_belakang}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Jam Praktek Dokter</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center">
                        {registration?.antrian?.jadwal_dokter?.jam_buka_praktek
                            ? timeStringFormatter(registration?.antrian?.jadwal_dokter?.jam_buka_praktek.toString())
                            : 'Jam tidak valid'}
                        {' - '}
                        {registration?.antrian?.jadwal_dokter?.jam_tutup_praktek
                            ? timeStringFormatter(registration?.antrian?.jadwal_dokter?.jam_tutup_praktek.toString())
                            : 'Jam tidak valid'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nama Wali</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.nama_wali} ({registration?.hub_wali?.nama_status_keluarga})
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">No Telp Wali</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.telp_wali}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nomor Rujukan</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.no_rujukan ?? '-'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nomor SEP</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.no_sep && registration?.no_sep !== '' ? registration?.no_sep : '-'}
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nomor Kontrol/Rujuk balik</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.nomor_rujuk_balik !== ' ' ? registration?.nomor_rujuk_balik : '-'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nomor COB</p>
                    <p className="px-4 py-2 bg-gray-50 rounded-md min-h-[40px] text-sm flex flex-col justify-center capitalize">
                        {registration?.cob ? registration?.cob : '-'}
                    </p>
                </div>
            </div>
            <div className="flex gap-4 flex-wrap mt-8 mb-6">
                <Button
                    onClick={handleSendQueueToBPJS}
                    disabled={
                        !registration?.antrian?.jadwal_dokter?.pegawai?.kode_dpjp ||
                        registration?.status_kirim_bpjs === 1 ||
                        postLoading ||
                        registration?.task_id_terakhir == 99
                    }
                >
                    {postLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Loading</span>
                        </>
                    ) : (
                        <span>{registration?.status_kirim_bpjs ? 'Antrean terkirim' : 'Kirim BPJS'}</span>
                    )}
                </Button>
                {registration?.antrian.jenis_penjamin === 2 && (
                    <Button
                        variant="outline"
                        disabled={
                            registration?.status_kirim_bpjs === 0 ||
                            registration?.task_id_terakhir === 99 ||
                            registration?.no_sep !== null
                        }
                        onClick={() => setOpenDialogSEP(true)}
                    >
                        {registration?.no_sep ? 'SEP Telah Dibuat' : ' Buat SEP'}
                    </Button>
                )}
            </div>
            <div className="my-4">
                {!registration?.antrian?.jadwal_dokter?.pegawai?.kode_dpjp && (
                    <p className="text-sm text-red-600 italic">* Dokter belum memiliki kode DPJP</p>
                )}
                {Number(registration?.status_kirim_bpjs) === 0 && (
                    <p className="text-sm text-red-600 italic">
                        * Untuk cetak SEP harus mengirim antrean ke BPJS terlebih dahulu
                    </p>
                )}
            </div>
            {openDialogSEP && (
                <SEPDialog
                    patient={patient}
                    openDialogSEP={openDialogSEP}
                    setOpenDialogSEP={setOpenDialogSEP}
                    registration={registration}
                    onRefresh={onRefresh}
                />
            )}
            {registration?.task_id_terakhir === 99 && (
                <Badge className="absolute top-6 right-4 animate-pulse">Antrean Batal</Badge>
            )}
        </>
    );
};

export default RegistrationCard;
