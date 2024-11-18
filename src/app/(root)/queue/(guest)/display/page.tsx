"use client"
import CounterCard from "@/app/(root)/queue/(guest)/display/components/counter-card";
import {toast} from "@/hooks/use-toast";
import {Expand, Minimize} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {CounterDisplayWS} from "@/types/admission-queue";
import {Skeleton} from "@/components/ui/skeleton";
import {buildAudioResource} from "@/app/(root)/queue/(guest)/display/utils/audio";

const AdmissionDisplay = () => {
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [error, setError] = useState<string>()
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const bellAudioRef = useRef<HTMLAudioElement | null>(null);
    const announcementAudioRef = useRef<HTMLAudioElement | null>(null);
    const numberAudioRef = useRef<HTMLAudioElement | null>(null);
    const [counters, setCounters] = useState<CounterDisplayWS[] | null>(null);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [audioQueue, setAudioQueue] = useState<string[]>([]);

    const handleFullscreen = () => {
        if (document) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {
                    toast({
                        description: 'Browser tidak mendukung fullscreen'
                    })
                });
                setIsExpand(true)
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {
                    toast({
                        description: 'Terjadi kesalahan saat minimize layar'
                    })
                });
                setIsExpand(false)
            }
        }
    }

    const playNextAudio = async () => {
        if (currentAudioIndex < audioQueue.length) {
            if (numberAudioRef.current) {
                numberAudioRef.current.src = audioQueue[currentAudioIndex];
                try {
                    await numberAudioRef.current.play();
                    numberAudioRef.current.onended = () => {
                        setCurrentAudioIndex(prev => prev + 1);
                    };
                } catch (error) {
                    console.error('Error playing number audio:', error);
                    setCurrentAudioIndex(prev => prev + 1);
                }
            }
        } else {
            setCurrentAudioIndex(0);
            setAudioQueue([]);
        }
    };

    const playSequentialAudio = async (counter: CounterDisplayWS) => {
        try {
            if (bellAudioRef.current) {
                bellAudioRef.current.currentTime = 0;
                await bellAudioRef.current.play();

                bellAudioRef.current.onended = async () => {
                    if (announcementAudioRef.current) {
                        announcementAudioRef.current.currentTime = 0;
                        try {
                            await announcementAudioRef.current.play();

                            announcementAudioRef.current.onended = () => {
                                const numberAudios = buildAudioResource(counter);
                                setAudioQueue(numberAudios);
                                setCurrentAudioIndex(0);
                            };
                        } catch (error: any) {
                            toast({
                                description: error?.message || error.toString()
                            })
                        }
                    }
                };
            }
        } catch (error: any) {
            toast({
                description: error?.message || error.toString()
            })
        }
    };

    useEffect(() => {
        if (audioQueue.length > 0 && currentAudioIndex < audioQueue.length) {
            playNextAudio();
        }
    }, [audioQueue, currentAudioIndex]);

    const refreshCounterValue = (counterDisplayWS: CounterDisplayWS) => {
        setCounters((prevCounter) => {
            return prevCounter?.map((counter) =>
                counter.id_ms_loket_antrian === counterDisplayWS.id_ms_loket_antrian
                    ? counterDisplayWS
                    : counter
            ) ?? [];
        });
        playSequentialAudio(counterDisplayWS);
    }

    useEffect(() => {
        const counterSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/admission-queue`);
        setSocket(counterSocket)
        counterSocket.emit('admission-queue-display-init');
        return () => {
            if (counterSocket) {
                counterSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (error) {
            toast({
                title: "Terjadi Kesalahan",
                description: error?.toString(),
                duration: 4000,
            })
        }
    }, [error]);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on(`error-${socket.id}`, (result) => {
                    setError(result?.errors || result?.error)
                    setLoading(false)
                });
                socket.on('admission-queue-display', (result) => {
                    if (result.data?.length !== 0) {
                        setCounters(result?.data)
                    }
                    setLoading(false)
                });
            });

            socket.on('admission-queue-calling-to-display', (result) => {
                refreshCounterValue(result?.data || result)
            });

            return () => {
                socket.off('connect-counter');
                socket.off('connect');
                socket.off(`error-${socket.id}`);
                socket.off(`admission-queue-display`);
                socket.off(`admission-queue-calling-to-display`);
            }
        }
    }, [socket]);

    return (
        <>
            <audio src="/audios/airport-bell.mp3" ref={bellAudioRef}/>
            <audio src="/audios/panggilan.mp3" ref={announcementAudioRef}/>
            <audio ref={numberAudioRef}/>
            <div
                className="flex-1 grid grid-cols-2 md:grid-cols-3
                xl:grid-cols-4 pt-8 md:pt-10 2xl:pt-16 mb-10 gap-6 relative z-20"
            >
                {
                    loading ? (
                        Array.from({length: 4}, (_, index: number) => (
                            <Skeleton key={index}
                                      className="w-full flex flex-col h-32 lg:h-40 xl:h-52 rounded-xl p-2.5"/>
                        ))
                    ) : (
                        counters?.map((counter: CounterDisplayWS, index: number) => {
                            return (
                                <CounterCard key={index} data={counter}/>
                            )
                        })
                    )
                }
            </div>
            <button className="fixed bottom-4 right-6" onClick={handleFullscreen}>
                {
                    isExpand ? (
                        <Minimize className="text-white w-4 h-4 hover:scale-125"/>
                    ) : (
                        <Expand className="text-white w-4 h-4 hover:scale-125"/>
                    )
                }
            </button>
        </>
    )
}

export default AdmissionDisplay;