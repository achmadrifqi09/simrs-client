import React, {useCallback, useEffect, useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import useGet from "@/hooks/use-get";
import {Register, RegisterResult} from "@/types/register";
import {Input} from "@/components/ui/input";
import debounce from "debounce";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";

interface SelectRegistrantProps {
    selectRegistrantShow: boolean;
    setSelectRegistrantShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectRegistrant = ({selectRegistrantShow, setSelectRegistrantShow}: SelectRegistrantProps) => {
    const [keyword, setKeyword] = useState<string>("")
    const {data, loading, getData} = useGet<Register>({
        url: `/registration`,
        keyword: keyword,
    })
    const {status} = useSession();
    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword: string = e.target.value;
        setKeyword(keyword);
    };
    const router = useRouter();
    const debouncedChangeSearch = useCallback(
        debounce(handleChangeSearch, 500),
        []
    );

    const handleChangeRegistrant = (id: number, rm: string | undefined, queueId: number) => {
        setSelectRegistrantShow(false)
        router.push(rm ?
            `/register/onsite/${id}?rm=${rm}` :
            `/register/onsite/patient?QUID=${queueId}`
        )
    }

    const handleDialog = () => {
        setSelectRegistrantShow((prev) => !prev)
    }

    useEffect(() => {
        if (status === 'authenticated') {
            getData().catch(() => {
                toast({
                    title: "Terjadi Kesalahan",
                    description: "Terjadi kesalahan saat mencari data",
                    duration: 4000,
                })
            });
        }
    }, [status, getData]);

    return (
        <Dialog
            open={selectRegistrantShow}
            onOpenChange={handleDialog}
        >
            <DialogTrigger></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pilih Pendaftaran</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder="Nama/Kode RM" onChange={debouncedChangeSearch}/>
                    <div className="max-h-64 overflow-y-auto mt-4">
                        {
                            !loading && (
                                data?.results.map((registrant: RegisterResult, i: number) => {
                                    return (
                                        <button
                                            key={i}
                                            className="px-4 py-2.5 hover:bg-gray-50 rounded-md text-sm text-gray-800 w-full text-left"
                                            onClick={() => handleChangeRegistrant(registrant.id, registrant.kode_rm, registrant.antrian.id_antrian)}
                                        >
                                            {registrant.antrian.nama_pasien} - {registrant.kode_rm ?? '(Pasien baru)'}
                                        </button>
                                    )
                                })
                            )
                        }
                        {
                            loading && (
                                <div
                                    className="px-4 bg-gray-50 py-2.5 rounded-md text-sm text-gray-800 w-full text-left flex justify-center gap-2">
                                    <Loader2 className="w-6 h-6 text-red-600 animate-spin"/>
                                    <p>Loading ...</p>
                                </div>
                            )
                        }
                        {
                            data?.results.length === 0 && (
                                <div
                                    className="px-4 bg-gray-50 py-2.5 rounded-md text-sm text-gray-800 w-full text-left flex justify-center gap-2">
                                    <p>Data tidak ditemukan</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default SelectRegistrant;