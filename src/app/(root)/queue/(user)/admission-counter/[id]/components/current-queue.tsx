import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/section';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { SetStateAction, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { AdmissionQueueWS } from '@/types/admission-queue';
import { timeStringFormatter } from '@/utils/date-formatter';
import { Separator } from '@/components/ui/separator';
import Cookies from 'js-cookie';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import { QueueWithRegistrationFromWs } from '@/types/register';

interface CurrentQueueProps {
    counterId: number;
    queueCode: string | null;
    currentQueue: AdmissionQueueWS | null;
    setCurrentQueue: React.Dispatch<SetStateAction<AdmissionQueueWS | null>>;
}

const CurrentQueue = ({ counterId, queueCode, currentQueue, setCurrentQueue }: CurrentQueueProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data: session, status } = useSession();
    const [remainingQueue, setRemainingQueue] = useState<number>(0);
    const router = useRouter();

    const handleCallQueue = () => {
        if (currentQueue) {
            socket?.emit('calling', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id,
            });
        } else {
            toast({
                description: 'Tidak ada antrean yang dipilih / antrian sudah habis',
            });
        }
    };

    const handleQueueSkip = () => {
        socket?.emit('skip-and-call', {
            id_antrian: currentQueue?.id_antrian,
            user_id: session?.user.id,
            id_ms_loket_antrian: counterId,
            kode_antrian: currentQueue?.kode_antrian,
        });
    };

    const handleCancellation = () => {
        if (currentQueue) {
            socket?.emit('cancel-and-call', {
                id_antrian: currentQueue?.id_antrian,
                user_id: session?.user.id,
                id_ms_loket_antrian: counterId,
                kode_antrian: currentQueue?.kode_antrian,
            });
        } else {
            toast({
                description: 'Tidak ada antrean yang dipilih / antrian sudah habis',
            });
        }
    };

    const handleQueueAttendance = () => {
        if (currentQueue) {
            socket?.emit('admission-attendance', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id,
                kode_antrian: currentQueue?.kode_antrian,
            });
        } else {
            toast({
                description: 'Tidak ada antrean yang dipilih / antrian sudah habis',
            });
        }
    };

    const handleQueueAttendanceWithoutNextCall = () => {
        if (currentQueue) {
            socket?.emit('admission-attend-and-continue-registration', {
                id_antrian: currentQueue?.id_antrian,
                id_ms_loket_antrian: counterId,
                user_id: session?.user.id,
                kode_antrian: currentQueue?.kode_antrian,
            });
        } else {
            toast({
                description: 'Tidak ada antrean yang dipilih / antrian sudah habis',
            });
        }
    };

    const handleNextQueueCall = () => {
        if (socket) {
            socket.emit('next-call', {
                id_ms_loket_antrian: counterId,
                kode_antrian: queueCode,
                id_user: session?.user.id,
            });
        }
    };

    useEffect(() => {
        const admissionQueueSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/admission`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });
        setSocket(admissionQueueSocket);
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

            socket.on(`pending-queue-${socket.id}`, (result) => {
                setCurrentQueue(result?.data);
            });

            socket.on(`queue-registration-result-${socket.id}`, (result: QueueWithRegistrationFromWs) => {
                console.log(result);
                if (result?.data) {
                    const url =
                        Number(result?.data?.jenis_pasien) === 1 &&
                        result?.data?.kode_rm &&
                        result?.data?.kode_rm !== ''
                            ? `/register/onsite/${result?.data?.id_pendaftaran}?rm=${result?.data?.kode_rm}`
                            : `/register/onsite/patient?QUID=${result?.data?.id_antrian}`;
                    router.push(url);
                } else {
                    toast({
                        title: 'Terjadi Kesalahan',
                        description:
                            'Tidak dapat menemukan data pendaftaran, silakan coba cari manual di menu pendaftaran',
                    });
                }
            });

            socket.on(`current-queue-${socket.id}`, (result) => {
                setCurrentQueue(result?.data);

                if (result?.data?.id_antrian) {
                    Cookies.set('ADMISSION_QUEUE_PENDING', result.data?.id_antrian);
                } else {
                    Cookies.remove('ADMISSION_QUEUE_PENDING');
                }
            });
        });

        if (queueCode) {
            socket.on(`remaining-${queueCode}`, (result) => {
                setRemainingQueue(Number(result) || 0);
            });

            const pandingQueueId = Cookies.get('ADMISSION_QUEUE_PENDING');
            if (pandingQueueId && !currentQueue) {
                socket.emit('pending-queue', Number(pandingQueueId));
            }
        }

        return () => {
            socket.off(`error-${socket.id}`);
            socket.off('connect');
            socket.off(`pending-queue-${socket.id}`);
            socket.off(`current-${queueCode}-${socket.id}`);
            socket.off(`remaining-${socket.id}`);
        };
    }, [status, socket, queueCode]);

    useEffect(() => {
        if (socket && queueCode) {
            socket.emit('remaining-queue-code', queueCode);
        }
    }, [socket, queueCode]);

    return (
        <div className="2xl:col-span-2 h-max space-y-6">
            <Section>
                <Heading headingLevel="h4" variant="section-title">
                    Antrean Dipanggil
                </Heading>
                {currentQueue ? (
                    <>
                        <div className="px-4 py-8 bg-gray-50 rounded-md border border-gray-100">
                            <h1 className="text-5xl md:text-6xl xl:text-8xl font-bold text-center text-gray-800">
                                {`${currentQueue?.kode_antrian}-${currentQueue?.no_antrian}`}
                            </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <Menubar className="px-0">
                                <MenubarMenu>
                                    <MenubarTrigger
                                        className="p-0 focus:text-white data-[state=open]:text-white"
                                        asChild
                                    >
                                        <Button className="px-4 text-white">Hadir</Button>
                                    </MenubarTrigger>
                                    <MenubarContent>
                                        <MenubarItem className="text-gray-500" onClick={handleQueueAttendance}>
                                            Hadir <ChevronRight className="w-4 h-4" />
                                            Panggil Selanjutnya
                                        </MenubarItem>
                                        <MenubarSeparator />
                                        <MenubarItem
                                            className="text-gray-500"
                                            onClick={handleQueueAttendanceWithoutNextCall}
                                        >
                                            Hadir <ChevronRight className="w-4 h-4" /> Pendaftaran
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" onClick={handleCallQueue}>
                                            Panggil
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Panggil antrean saat ini</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" onClick={handleQueueSkip}>
                                            Lewati
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            Lewati antrean saat ini
                                            <br />
                                            dan panggil selanjutnya
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" onClick={handleCancellation}>
                                            Batalkan
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            Batalkan antrean saat ini dan
                                            <br /> panggil selanjutanya
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="mt-6">
                            <p>Detail Antrean</p>
                            <Separator className="mt-1 mb-4" />
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
                                        <span>{currentQueue?.jadwal_dokter.pegawai.gelar_depan} </span>
                                        <span>{currentQueue?.jadwal_dokter.pegawai.nama_pegawai} </span>
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
                    <>
                        <div className="px-4 py-6 bg-gray-50 rounded-md border border-gray-100">
                            <p className="text-gray-800 text-center">
                                <b>{remainingQueue} pasien </b>
                                dengan kode <b>{queueCode}</b> belum di panggil
                            </p>
                        </div>
                        <Button onClick={handleNextQueueCall} className="mt-4" disabled={remainingQueue === 0}>
                            Mulai Panggil
                        </Button>
                    </>
                )}
            </Section>
        </div>
    );
};

export default CurrentQueue;
