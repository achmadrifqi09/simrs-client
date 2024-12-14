import { Button } from '@/components/ui/button';
import FormError from '@/components/ui/form-error';
import SkeletonTable from '@/components/ui/skeleton-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useGet from '@/hooks/use-get';
import { usePatch } from '@/hooks/use-patch';
import { toast } from '@/hooks/use-toast';
import { Doctor, QueueSchedule } from '@/types/doctor-schedule';
import { timeStringFormatter } from '@/utils/date-formatter';
import { checkDateIsNow, checkTimeMissed } from '@/utils/time-checker';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DoctorScheduleProps {
    doctorScheduleId: number;
    unitCode: string;
    queueId: number;
    onRefresh: () => void;
}

const DoctorScheduleTable = ({ doctorScheduleId, unitCode, queueId, onRefresh }: DoctorScheduleProps) => {
    const { data, loading, error, getData } = useGet<Doctor[]>({
        isGuest: true,
        url: `/doctor-schedule/current/${unitCode}`,
        keyword: '',
    });
    const [isSkeleton, setIsSkeleton] = useState<boolean>(true);
    const { updateData, patchLoading, patchError } = usePatch();

    const handleUpdateDoctorSchedule = async (doctorScheduleId: number) => {
        if (!Number(queueId)) {
            toast({
                title: 'Terjadi Kesalahan',
                description: 'Data antrean tidak ditemukan',
            });
            return;
        }
        const response = await updateData(`/queue/${queueId}/doctor-schedule`, { id_jadwal_dokter: doctorScheduleId });
        if (response?.status_code === 200) {
            setIsSkeleton(false);
            onRefresh();
            await getData().catch(() => {
                toast({
                    title: 'Terjadi kesalahan',
                    description: error?.toString(),
                });
            });
            toast({
                title: 'Aksi Berhasil',
                description: 'Berhasil memindahkan jadwal dokter',
            });
        }
    };

    const checkRegistrationAvailability = (doctorSchedule: QueueSchedule) => {
        if (doctorSchedule) {
            if (checkTimeMissed(doctorSchedule.jam_tutup_praktek)) return false;

            if (
                doctorSchedule.kuota_terisi === doctorSchedule.kuota_onsite ||
                doctorSchedule.kuota_terisi >= doctorSchedule.kuota_onsite
            )
                return false;

            if (
                !checkTimeMissed(doctorSchedule.jam_tutup_praktek) &&
                doctorSchedule.kuota_terisi === doctorSchedule.kuota_onsite
            )
                return false;

            if (doctorSchedule?.tanggal_libur && checkDateIsNow(doctorSchedule?.tanggal_libur)) return false;
        }
        return true;
    };

    return (
        <div className="xl:col-span-2">
            <p className="mb-2 text-sm font-medium">Jadwal Dokter</p>
            {!loading && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Dokter</TableHead>
                            <TableHead>Jam Praktek</TableHead>
                            <TableHead>Kuota</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((doctor: Doctor, i: number) => {
                            return doctor?.jadwal?.length > 1
                                ? doctor?.jadwal?.map((schedule: QueueSchedule, x: number) => {
                                      return (
                                          <TableRow key={x}>
                                              <TableCell>
                                                  {doctor?.gelar_depan} {doctor?.nama_dokter} {doctor?.gelar_belakang}
                                              </TableCell>
                                              <TableCell>
                                                  {timeStringFormatter(schedule?.jam_buka_praktek)} -{' '}
                                                  {timeStringFormatter(schedule?.jam_tutup_praktek)}
                                              </TableCell>
                                              <TableCell>
                                                  {schedule?.kuota_terisi}/{schedule?.kuota_onsite}
                                              </TableCell>
                                              <TableCell>
                                                  <Button
                                                      size="sm"
                                                      className="w-32"
                                                      type="button"
                                                      onClick={() =>
                                                          handleUpdateDoctorSchedule(schedule?.id_jadwal_dokter)
                                                      }
                                                      disabled={
                                                          schedule?.id_jadwal_dokter === doctorScheduleId ||
                                                          !checkRegistrationAvailability(schedule) ||
                                                          patchLoading
                                                      }
                                                  >
                                                      {schedule?.id_jadwal_dokter === doctorScheduleId ? (
                                                          'Dipilih'
                                                      ) : !checkRegistrationAvailability(schedule) ? (
                                                          'Tutup'
                                                      ) : patchLoading ? (
                                                          <>
                                                              <Loader2 className="w-5 h-5 animate-spin mr-1" />
                                                              <span>Loading</span>
                                                          </>
                                                      ) : (
                                                          'Pilih'
                                                      )}
                                                  </Button>
                                              </TableCell>
                                          </TableRow>
                                      );
                                  })
                                : doctor?.jadwal?.length === 1 && (
                                      <TableRow key={i}>
                                          <TableCell>
                                              {doctor?.gelar_depan} {doctor?.nama_dokter} {doctor?.gelar_belakang}
                                          </TableCell>
                                          <TableCell>
                                              {timeStringFormatter(doctor?.jadwal?.[0]?.jam_buka_praktek)} -{' '}
                                              {timeStringFormatter(doctor?.jadwal?.[0]?.jam_tutup_praktek)}
                                          </TableCell>
                                          <TableCell>
                                              {doctor?.jadwal?.[0]?.kuota_terisi}/{doctor?.jadwal?.[0]?.kuota_onsite}
                                          </TableCell>
                                          <TableCell>
                                              <Button
                                                  className="w-32"
                                                  type="button"
                                                  size="sm"
                                                  onClick={() =>
                                                      handleUpdateDoctorSchedule(doctor?.jadwal?.[0].id_jadwal_dokter)
                                                  }
                                                  disabled={
                                                      doctor?.jadwal?.[0]?.id_jadwal_dokter === doctorScheduleId ||
                                                      !checkRegistrationAvailability(doctor?.jadwal?.[0]) ||
                                                      patchLoading
                                                  }
                                              >
                                                  {doctor?.jadwal?.[0]?.id_jadwal_dokter === doctorScheduleId ? (
                                                      'Dipilih'
                                                  ) : !checkRegistrationAvailability(doctor?.jadwal?.[0]) ? (
                                                      'Tutup'
                                                  ) : patchLoading ? (
                                                      <>
                                                          <Loader2 className="w-5 h-5 animate-spin mr-1" />
                                                          <span>Loading</span>
                                                      </>
                                                  ) : (
                                                      'Pilih'
                                                  )}
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  );
                        })}
                    </TableBody>
                </Table>
            )}
            {patchError && <FormError errors={patchError} />}
            {loading && isSkeleton && <SkeletonTable />}
        </div>
    );
};

export default DoctorScheduleTable;
