import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import React, {useEffect, useState} from "react";
import useGet from "@/hooks/use-get";
import type {DoctorSchedule, DoctorScheduleWithPagination} from "@/types/doctor-schedule";
import {toast} from "@/hooks/use-toast";
import {Action} from "@/enums/action";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Permission} from "@/types/permission";
import SelectSearch from "@/components/ui/select-search";
import {QueueUnit} from "@/types/outpatient";
import {formatISODayToNormalDay} from "@/lib/formatter/date-formatter";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import CursorPagination from "@/components/ui/cursor-pagination";
import {timeStringFormatter} from "@/utils/time-formatter";

interface PerPolyclinicTableProps {
    refreshTrigger: number;
    selectRecord: React.Dispatch<React.SetStateAction<DoctorSchedule | null>>
    onChangeStatus?: (id: number | undefined, status: number | undefined) => void;
    setAction: React.Dispatch<React.SetStateAction<Action>>
    setAlertDelete: React.Dispatch<React.SetStateAction<boolean>>
    permission: Permission | null
}

const PerPolyclinicTable = (
    {
        refreshTrigger,
        selectRecord,
        setAction,
        setAlertDelete,
        permission
    }: PerPolyclinicTableProps) => {
    const [queueUnit, setQueueUnit] = useState<string | number>("");
    const [clearTrigger, setClearTrigger] = useState<number>(0)
    const url: string = '/doctor-schedule'
    const {status} = useSession();
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const {data, loading, error, getData} = useGet<DoctorScheduleWithPagination>({
        url: `${url}?poly_code=${queueUnit}`,
        cursor: cursor,
        take: takeData
    })

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
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                })
            });
        }
    }, [refreshTrigger, getData, status]);

    return (
        <>
            <div className="flex gap-1">
                {
                    status == 'loading' ? (
                        <>
                            <Skeleton className="w-full md:w-1/3 h-10"/>
                            <Skeleton className="w-full md:w-1/3 h-10"/>
                        </>
                    ) : (
                        <>
                            <div className="w-full lg:w-1/3">
                                <SelectSearch<QueueUnit>
                                    url="/work-unit/queue-unit"
                                    labelName="nama_unit_kerja"
                                    valueName="kode_instalasi_bpjs"
                                    onChange={(value) => setQueueUnit(value || '')}
                                    defaultValue={queueUnit}
                                    clearTrigger={clearTrigger}
                                />
                            </div>
                            <Button
                                size="icon"
                                variant="outline"
                                className="border-gray-200 py-4"
                                onClick={() => {
                                    setQueueUnit('');
                                    setClearTrigger(clearTrigger + 1)
                                }}>
                                <X className="text-gray-400 hover:text-red-600"/>
                            </Button>
                        </>
                    )
                }
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-sm py-2">No</TableHead>
                        <TableHead className="text-sm py-2">Poliklinik</TableHead>
                        <TableHead className="text-sm py-2">Dokter</TableHead>
                        <TableHead className="text-sm py-2">Hari / Tgl praktek</TableHead>
                        <TableHead className="text-sm py-2">Jam buka praktek</TableHead>
                        <TableHead className="text-sm py-2">Jam tutup praktek</TableHead>
                        <TableHead className="text-sm py-2">Kuota MJKN</TableHead>
                        <TableHead className="text-sm py-2">Kuota online umum</TableHead>
                        <TableHead className="text-sm py-2">Kuota onsite</TableHead>
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
                                        <TableCell>
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
                                            {
                                                schedule?.jenis_jadwal == 1 ? (
                                                    formatISODayToNormalDay(schedule.hari_praktek)
                                                ) : (schedule.tgl_praktek && (schedule.tgl_praktek.split('T')[0]))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {timeStringFormatter(schedule.jam_buka_praktek)}
                                        </TableCell>
                                        <TableCell>
                                            {timeStringFormatter(schedule.jam_tutup_praktek)}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.kuota_mjkn}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.kuota_online_umum}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.kuota_onsite}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                (permission?.can_update || permission?.can_delete) && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(schedule);
                                                                setAction(Action.UPDATE_FIELDS)
                                                            }}
                                                            size="sm">
                                                            Update
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                selectRecord(schedule);
                                                                setAction(Action.DELETE)
                                                                setAlertDelete(true)
                                                            }}
                                                            size="sm" variant="outline">
                                                            Hapus
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
                loading || status === 'loading' ? (
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

export default PerPolyclinicTable
