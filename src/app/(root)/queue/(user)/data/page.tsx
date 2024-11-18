"use client";
import React, {useCallback, useEffect, useState} from "react";
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {Filter} from "lucide-react";
import {Label} from "@/components/ui/label";
import {useSession} from "next-auth/react";
import useGet from "@/hooks/use-get";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {AdmissionQueue, AdmissionQueues} from "@/types/admission-queue";
import {Skeleton} from "@/components/ui/skeleton";
import CursorPagination from "@/components/ui/cursor-pagination";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatToStandardDate} from "@/utils/time-formatter";
import DrawerTaskId from "@/app/(root)/queue/(user)/data/components/drawer-task-id";

type DateFilter = {
    fromDate: string,
    toDate: string,
}

const QueueDataTable = () => {
    const [filter, setFilter] = useState<DateFilter>({
        fromDate: new Date().toISOString().split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
    });
    const url: string = '/queue'
    const {status} = useSession();
    const [canRefresh, setCanRefresh] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [cursor, setCursor] = useState<number>(0);
    const [takeData, setTakeData] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [showTaskId, setShowTaskId] = useState<boolean>(false)
    const [selectedQueue, setSelectedQueue] = useState<AdmissionQueue | null>(null)

    const {data, loading, error, getData} = useGet<AdmissionQueues>({
        url: `${url}?from_date=${filter.fromDate}&to_date=${filter.toDate}`,
        keyword: searchKeyword,
        take: takeData,
        cursor: cursor
    })

    const handleShowTaskId = (queue: AdmissionQueue | null) => {
        if (showTaskId) {
            setSelectedQueue(null)
        } else {
            setSelectedQueue(queue)
        }
        setShowTaskId(prev => !prev)
    }

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setSearchKeyword(keyword);
        setCanRefresh(true);
    };

    const handleChangeDataPerPage = (value: number) => {
        setTakeData(value);
        setCursor(0);
        setCanRefresh(true);
    };

    const handleNextPage = () => {
        if (data?.pagination?.current_cursor !== undefined) {
            setCursor(data.pagination.current_cursor + takeData);
        }
    };

    const handlePreviousPage = () => {
        const newCursor = Math.max(0, cursor - takeData);
        setCursor(newCursor);
        setCanRefresh(true);
    };

    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilter({...filter, [name]: value});
        setCanRefresh(true);
    };

    useEffect(() => {
        setTitle(`Rentang tanggal ${formatToStandardDate(filter.fromDate)} - ${formatToStandardDate(filter.toDate)}`);
        setCursor(data?.pagination?.current_cursor || 0)
    }, [data]);

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
        if (status === 'authenticated' && canRefresh) {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat memperbarui data di tabel",
                    duration: 4000,
                })
            });
        }
    }, [getData, status])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">
                Daftar Antrean
            </Heading>
            <Section>
                <Heading headingLevel="h5" variant="section-title" className="mb-6">
                    {title}
                </Heading>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <Input
                        type="search"
                        className="w-full md:w-1/3"
                        placeholder="Nama/RM/BPJS/No Rujukan"
                        onChange={debouncedChangeSearch}/>
                    <div className="flex w-full justify-end md:block md:w-max">
                        <Popover open={showFilter} onOpenChange={setShowFilter}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost">
                                    <Filter className="w-4 h-4 mr-1.5"/>
                                    Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-[20em] space-y-3">
                                <div>
                                    <Label>Dari Tanggal</Label>
                                    <Input
                                        type="date"
                                        className="block mt-1"
                                        name="fromDate"
                                        defaultValue={filter.fromDate}
                                        onChange={handleChangeFilter}/>
                                </div>
                                <div>
                                    <Label>Sampai Tanggal</Label>
                                    <Input
                                        type="date"
                                        name="toDate"
                                        className="block mt-1"
                                        defaultValue={filter.toDate}
                                        onChange={handleChangeFilter}/>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Pasien</TableHead>
                            <TableHead>No Antrean</TableHead>
                            <TableHead>Kode RM</TableHead>
                            <TableHead>No BPJS</TableHead>
                            <TableHead>No Rujukan</TableHead>
                            <TableHead>Jenis Penjamin</TableHead>
                            <TableHead>Jenis Pasien</TableHead>
                            <TableHead>Poli Tujuan</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            (loading || status == 'loading') ? (
                                Array.from({length: 2}, (_, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-16 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-5 w-12 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Skeleton className="h-8 w-10 rounded md:w-1/2 rounded-lg"/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                data?.results?.map((queue: AdmissionQueue, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-medium">{queue?.nama_pasien}</TableCell>
                                                <TableCell
                                                    className="font-medium">{queue?.kode_antrian}-{queue.no_antrian}</TableCell>
                                                <TableCell className="font-medium">{queue?.kode_rm || '-'}</TableCell>
                                                <TableCell className="font-medium">{queue?.no_bpjs || '-'}</TableCell>
                                                <TableCell
                                                    className="font-medium">{queue?.no_rujukan || '-'}</TableCell>
                                                <TableCell
                                                    className="font-medium">{
                                                    queue?.jenis_penjamin === 1 ? 'Umum' : 'BPJS'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {queue?.jenis_pasien === 1 ? 'Lama' : 'Baru'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {queue?.jadwal_dokter.kode_instalasi_bpjs || '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Button size="sm" disabled={Number(queue.jenis_penjamin) === 1} onClick={() => handleShowTaskId(queue)}>
                                                        Task ID
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    )
                                })
                            )
                        }
                        {(data && data?.results?.length === 0 && !loading) && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">Data tidak ditemukan</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {
                    (loading || status === 'loading') ? (
                        <div className="flex justify-between items-center mt-2">
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
                {selectedQueue && (
                    <DrawerTaskId
                        showTaskId={showTaskId}
                        setShowTaskId={setShowTaskId}
                        selectedQueue={selectedQueue}
                        setSelectedQueue={setSelectedQueue}
                    />
                )
                }
            </Section>
        </>
    );
};

export default QueueDataTable;
