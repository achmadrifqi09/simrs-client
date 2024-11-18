import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import Section from "@/components/ui/section";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import React, {SetStateAction, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {AdmissionQueueWS} from "@/types/admission-queue";
import {timeStringFormatter} from "@/utils/time-formatter";
import {Separator} from "@/components/ui/separator";
import {usePathname} from "next/navigation";


interface CurrentQueueProps {
    counterId: number;
    queueCode: string | null;
    currentQueue: AdmissionQueueWS | null,
    setCurrentQueue: React.Dispatch<SetStateAction<AdmissionQueueWS | null>>;
}

const CurrentQueue = ({counterId, queueCode, currentQueue, setCurrentQueue}: CurrentQueueProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const {data: session, status} = useSession();
    const path = usePathname()
    const handleCallQueue = () => {
        if (currentQueue) {
            socket?.emit('admission-queue-calling', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id
            })
        } else {
            toast({
                description: "Tidak ada antrean yang dipilih / antrian sudah habis"
            })
        }
    }

    const handleChangeQueueCode = (code: string) => {
        if (window) window.location.replace(`${path}?queue_code=${code}`)
    }

    const handleQueueSkip = () => {
        socket?.emit('admission-queue-skip', {
            id_antrian: currentQueue?.id_antrian,
            user_id: session?.user.id,
            status_panggil: 2,
            id_ms_loket_antrian: counterId,
            kode_antrian: currentQueue?.kode_antrian,
        })
    }

    const handleQueueCancellationInSkip = () => {
        if (currentQueue) {
            socket?.emit('admission-queue-cancelled', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id,
                kode_antrian: currentQueue?.kode_antrian,
            })
        } else {
            toast({
                description: "Tidak ada antrean yang dipilih / antrian sudah habis"
            })
        }
    }

    const handleQueueAttendance = () => {
        if (currentQueue) {
            socket?.emit('admission-queue-attendance', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id,
                kode_antrian: currentQueue?.kode_antrian,
            })
        } else {
            toast({
                description: "Tidak ada antrean yang dipilih / antrian sudah habis"
            })
        }
    }

    useEffect(() => {
        const admissionQueueSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/admission-queue`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        setSocket(admissionQueueSocket)
        return () => {
            if (admissionQueueSocket) {
                admissionQueueSocket.disconnect();
            }
        };
    }, [status]);

    useEffect(() => {
        if (!socket || status !== 'authenticated') return;

        socket.on('connect', () => {
            socket.on(`error-${socket.id}`, (result) => {
                toast({
                    description: result?.error,
                });
            });

            socket.on(`admission-queue-${counterId}`, (result) => {
                setCurrentQueue(result?.data)
            });
        });

        socket.emit('admission-queue', {
            queue_code: queueCode,
            counter_id: counterId
        });

        return () => {
            socket.off(`error-${socket.id}`);
            socket.off('connect');
        };
    }, [status, socket]);

    return (
        <div className="2xl:col-span-2 h-max space-y-6">
            <Section>
                <Heading headingLevel="h4" variant="section-title">
                    Pindah Kode Antrean
                </Heading>
                <p className="mb-2">Kode antrean saat ini : {queueCode}</p>
                <div className="grid grid-cols-4 gap-4">
                    <Button
                        variant={queueCode?.toLowerCase() == 'a' ? 'default' : 'outline'}
                        disabled={queueCode?.toLowerCase() == 'a'}
                        onClick={() => handleChangeQueueCode('A')}
                    >
                        A
                    </Button>
                    <Button
                        variant={queueCode?.toLowerCase() == 'b' ? 'default' : 'outline'}
                        disabled={queueCode?.toLowerCase() == 'b'}
                        onClick={() => handleChangeQueueCode('B')}
                    >
                        B
                    </Button>
                    <Button
                        variant={queueCode?.toLowerCase() == 'c' ? 'default' : 'outline'}
                        disabled={queueCode?.toLowerCase() == 'c'}
                        onClick={() => handleChangeQueueCode('C')}
                    >
                        C
                    </Button>
                    <Button
                        variant={queueCode?.toLowerCase() == 'd' ? 'default' : 'outline'}
                        disabled={queueCode?.toLowerCase() == 'd'}
                        onClick={() => handleChangeQueueCode('D')}
                    >
                        D
                    </Button>
                </div>
            </Section>
            <Section>
                <Heading headingLevel="h4" variant="section-title">
                    Antrean Dipanggil
                </Heading>
                {
                    currentQueue ? (
                        <>
                            <div className="px-4 py-8 bg-gray-50 rounded-md border border-gray-100">
                                <h1 className="text-5xl md:text-6xl xl:text-8xl font-bold text-center text-gray-800">
                                    {`${currentQueue?.kode_antrian}-${currentQueue?.no_antrian}`}
                                </h1>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handleQueueAttendance}>Hadir</Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">
                                                Konfirmasi hadir dan<br/> panggil selanjutnya
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" onClick={handleCallQueue}>
                                                Panggil
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">
                                                Panggil antrean saat ini
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" onClick={handleQueueSkip}>Lewati</Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">
                                                Lewati antrean saat ini<br/>dan panggil selanjutnya
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline"
                                                    onClick={handleQueueCancellationInSkip}>Batalkan</Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">
                                                Batalkan antrean saat ini dan<br/> panggil selanjutanya
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="mt-6">
                                <p>Detail Antrean</p>
                                <Separator className="mt-1 mb-4"/>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4 mt-2">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama pasien</p>
                                        <p>{currentQueue?.nama_pasien}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Jenis pasien</p>
                                        <p>{currentQueue?.jenis_penjamin === 1 ? 'Umum' : 'BPJS'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Kode poli tujuan</p>
                                        <p>{currentQueue?.jadwal_dokter.kode_instalasi_bpjs}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Dokter</p>
                                        <div>
                                            <span>{currentQueue?.jadwal_dokter.pegawai.gelar_depan}{" "}</span>
                                            <span>{currentQueue?.jadwal_dokter.pegawai.nama_pegawai}{" "}</span>
                                            <span>{currentQueue?.jadwal_dokter.pegawai.gelar_belakang}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Jam praktek</p>
                                        <p>
                                            {timeStringFormatter(currentQueue?.jadwal_dokter.jam_buka_praktek.toString())} -
                                            {timeStringFormatter(currentQueue?.jadwal_dokter.jam_tutup_praktek.toString())}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-6 bg-gray-50 rounded-md border border-gray-100">
                            <p className="text-gray-800 text-center">
                                Tidak ada antrean dengan kode {queueCode} yang belum <br/>di panggil.{" "}
                            </p>
                        </div>
                    )
                }
            </Section>
        </div>
    )
}

export default CurrentQueue