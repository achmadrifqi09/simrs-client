import React, {useEffect, useState} from "react";
import {DoctorSchedule, type DoctorScheduleWithPagination} from "@/types/doctor-schedule";
import {Permission} from "@/types/permission";
import useGet from "@/hooks/use-get";
import {toast} from "@/hooks/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {dateFormatter, timeStringFormatter} from "@/utils/date-formatter";
import {Skeleton} from "@/components/ui/skeleton";
import CursorPagination from "@/components/ui/cursor-pagination";
import {useSession} from "next-auth/react";
import moment from "moment";
import DoctorVacationDialog from "@/app/(root)/doctor-schedule/practice/doctor-vacation-dialog";
import {usePatch} from "@/hooks/use-patch";
import AdditionalQuota from "@/app/(root)/doctor-schedule/practice/additional-quota";
import {Action} from "@/enums/action";

interface ScheduleProps {
    date: Date | undefined
    permission: Permission | null
    refreshTrigger: number
    onRefresh: () => void,
    actionType: Action;
    setAction: React.Dispatch<React.SetStateAction<Action>>
}

const SchedulePerDate = ({
                             date,
                             permission,
                             refreshTrigger,
                             onRefresh,
                             setAction
                         }: ScheduleProps) => {

    const url: string = '/doctor-schedule'
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const [show, setShow] = useState<boolean>(false);
    const [id, setId] = useState<number | undefined>();
    const [selectedDate, setSelectedDate] = useState<string>(dateFormatter(date));
    const {updateData, patchLoading} = usePatch();
    const {data: session} = useSession();

    const [openQuotaDialog, setOpenQuotaDialog] = useState<boolean>(false)

    const {data, loading, error, getData} = useGet<DoctorScheduleWithPagination>({
        url: `${url}?practice_date=${selectedDate}`,
        cursor: cursor,
        take: takeData
    })

    const handleQuotaDialog = (id: number | undefined) => {
        setId(id)
        setOpenQuotaDialog(true)
    }
    const {status} = useSession()
    const handleChangeDataPerPage = (value: number) => {
        setTakeData(value);
        setCursor(0);
    };
    const handleNextPage = () => {
        if (data?.pagination?.current_cursor !== undefined) {
            setCursor(data.pagination.current_cursor + takeData);
        }
    };

    const handlePreviousPage = () => {
        const newCursor = Math.max(0, cursor - takeData);
        setCursor(newCursor);
    };

    const handleCancelVacation = async (id: number) => {
        if (!session?.accessToken) {
            return;
        }
        const response = await updateData(
            `/doctor-schedule/${id}/cancel-vacation`,
            {}
        )

        if (response?.data) {
            onRefresh()
            toast({
                title: "Aksi Berhasil",
                description: 'Berhasil Membatalkan jadwal libur',
            })
        }
    }

    const handleIsVacation = (vacationDate: string | null) => {
        if (vacationDate) {
            if (moment(dateFormatter(new Date(vacationDate))).isSame(moment(dateFormatter(date)))) {
                return true
            }
        }
        return false
    }

    useEffect(() => {
        if (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString(),
                duration: 4000,
            })
        }

    }, [error])

    useEffect(() => {
        if (status === 'authenticated') {
            if (date) {
                setSelectedDate(dateFormatter(date))
            }
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                })
            });
        }

    }, [status, date]);
    return (
        <>
            <DoctorVacationDialog
                setShow={setShow}
                show={show}
                id={id}
                vacation_date={date}
                onRefresh={onRefresh}/>

            <AdditionalQuota
                onRefresh={onRefresh}
                show={openQuotaDialog}
                setShow={setOpenQuotaDialog}
                id={id}
                currentDate={date}
                actionType={Action.CREATE}/>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-sm py-2">No</TableHead>
                        <TableHead className="text-sm py-2">Poliklinik</TableHead>
                        <TableHead className="text-sm py-2">Dokter</TableHead>
                        <TableHead className="text-sm py-2">Jam buka praktek</TableHead>
                        <TableHead className="text-sm py-2">Jam tutup praktek</TableHead>
                        <TableHead className="text-sm py-2">Kuota MJKN</TableHead>
                        <TableHead className="text-sm py-2">Kuota online umum</TableHead>
                        <TableHead className="text-sm py-2">Kuota onsite</TableHead>
                        <TableHead className="text-sm py-2">libur</TableHead>
                        <TableHead className="text-sm py-2">Keterangan</TableHead>
                        {
                            (permission?.can_update || permission?.can_delete) && (
                                <TableHead className="text-sm py-2">Aksi</TableHead>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.results?.map((schedule: DoctorSchedule, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {schedule.unit?.nama_unit_kerja}
                                        </TableCell>
                                        <TableCell className="min-w-[16ch]">
                                            <span
                                                className="capitalize">
                                                {schedule.pegawai?.gelar_depan?.toLocaleLowerCase() + '. ' || ''}
                                            </span>
                                            <span
                                                className="capitalize">
                                                {schedule.pegawai?.nama_pegawai.toLocaleLowerCase() + ' '}
                                            </span>
                                            <span
                                                className="capitalize">
                                                {schedule.pegawai?.gelar_belakang?.toLocaleLowerCase() || ''}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {timeStringFormatter(schedule.jam_buka_praktek)}
                                        </TableCell>
                                        <TableCell>
                                            {timeStringFormatter(schedule.jam_tutup_praktek)}
                                        </TableCell>
                                        <TableCell>
                                            {(
                                                schedule.kuota_tambahan?.length == 1
                                                    ? schedule.kuota_tambahan[0]?.kuota_mjkn
                                                    + schedule.kuota_mjkn : schedule.kuota_mjkn
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {(
                                                schedule.kuota_tambahan?.length == 1
                                                    ? schedule.kuota_tambahan[0]?.kuota_online_umum
                                                    + schedule.kuota_online_umum : schedule.kuota_online_umum
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {(
                                                schedule.kuota_tambahan?.length == 1
                                                    ? schedule.kuota_tambahan[0]?.kuota_onsite
                                                    + schedule.kuota_onsite : schedule.kuota_onsite
                                            )}
                                        </TableCell>
                                        <TableCell>{handleIsVacation(schedule?.tanggal_libur) ? 'Ya' : 'Tidak'}</TableCell>
                                        <TableCell>{handleIsVacation(schedule?.tanggal_libur) ? schedule.keterangan_libur : '-'}</TableCell>
                                        <TableCell>
                                            {
                                                (permission?.can_update || permission?.can_delete) && (
                                                    <div className="flex gap-2">
                                                        {
                                                            handleIsVacation(schedule?.tanggal_libur)
                                                                ? (

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            handleCancelVacation(schedule.id_jadwal_dokter)
                                                                            setAction(Action.UPDATE_FIELDS)
                                                                        }}
                                                                    >
                                                                        Batalkan Libur
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setShow(true)
                                                                            setId(schedule.id_jadwal_dokter)
                                                                        }}>
                                                                        Libur
                                                                    </Button>
                                                                )}
                                                        <Button variant='outline'
                                                                size='sm'
                                                                onClick={() => {
                                                                    handleQuotaDialog(schedule.id_jadwal_dokter)
                                                                }}
                                                        >
                                                            Tambah Kuota
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                        })
                    }
                    {(data && data?.results?.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={(permission?.can_update || permission?.can_delete) ? 10 : 9}
                                       className="text-center">Data tidak ditemukan</TableCell>
                        </TableRow>
                    )}
                    {
                        loading || status === 'loading' && (
                            Array.from({length: 4}, (_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-12 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-5 w-1/2 rounded-lg"/>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Skeleton className="h-8 w-12 rounded-lg"/>
                                    </TableCell>
                                    {
                                        (permission?.can_update || permission?.can_delete) && (
                                            <TableCell className="text-center flex gap-4">
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                                <Skeleton className="h-10 w-16 rounded-lg"/>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
            {
                patchLoading || status === 'loading' ? (
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-[128px] rounded-lg"/>
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                            <Skeleton className="h-10 w-10 rounded-lg"/>
                        </div>
                    </div>
                ) : (
                    <CursorPagination
                        currentCursor={data?.pagination?.current_cursor || 0}
                        take={takeData}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                        onItemsPerPageChange={handleChangeDataPerPage}
                        hasMore={(data?.results?.length || 0) >= takeData}
                    />
                )
            }

        </>
    )
}

export default SchedulePerDate
