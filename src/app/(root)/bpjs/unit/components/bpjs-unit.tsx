import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {toast} from "@/hooks/use-toast";
import {PolyclinicBPJS, PolyclinicBPJSResponse} from "@/types/polyclinic-bpjs";
import {useSession} from "next-auth/react";
import axios, {AxiosResponse} from "axios";
import {generateSignature} from "@/lib/crypto-js/cipher";
import {Skeleton} from "@/components/ui/skeleton";
import {ClipboardList} from "lucide-react";

const BPJSUnit = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [BPJSUnits, setBPJSUnits] = useState<PolyclinicBPJSResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {data: session, status} = useSession();

    const handleSearchBPJSUnit = async () => {
        if (status === 'authenticated') {
            if (keyword) {
                try {
                    setBPJSUnits(null)
                    setLoading(true)
                    const response: AxiosResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bpjs/v-claim/reference/polyclinic/${keyword}`,
                        {
                            headers: {
                                'client-signature': generateSignature(),
                                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                                'Authorization': `Bearer ${session?.accessToken}`
                            }
                        })

                    if (response?.status === 200 && response.data?.data) {
                        setBPJSUnits(response.data?.data)
                        setError(null)
                    } else {
                        setError('Data tidak ditemukan')
                    }
                } catch (error: any) {
                    setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
                } finally {
                    setLoading(false)
                }
            } else {
                toast({
                    description: 'Masukkan nama poliklinik yang ingin anda cari'
                })
            }
        }
    }

    const handleClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            toast({
                description: `Kode ${text} disalin`,
                duration: 1000,
            })
            return await navigator.clipboard.writeText(text);
        } else {
            toast({
                description: `Kode ${text} disalin`,
                duration: 1000,
            })
            return document.execCommand('copy', true, text);
        }

    }
    return (
        <Section className="col-span-1">
            <Heading headingLevel="h5" variant="section-title">
                Unit BPJS
            </Heading>
            <div className="flex gap-4 items-center">
                <Input
                    type="search" placeholder="Nama poliklinik .."
                    onChange={(e) => setKeyword(e.target.value)}/>
                <Button onClick={handleSearchBPJSUnit} variant="outline">Cari</Button>
            </div>
            <ul className="mt-4 space-y-2">
                {
                    BPJSUnits?.poli?.map((polyclinic: PolyclinicBPJS, index: number) => {
                        return (
                            <li
                                className="p-3 rounded-md text-sm bg-gray-50"
                                key={index}>
                                <p className="capitalize font-medium">{polyclinic.nama.toLocaleLowerCase()}</p>
                                <div className="flex gap-2 items-center mt-2">
                                    <span>Kode</span>
                                    <span>{polyclinic.kode}</span>
                                    <button onClick={() => handleClipboard(polyclinic.kode)}>
                                        <ClipboardList className="text-gray-500 w-4 h-4"/>
                                    </button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            {
                (!loading && error) && (
                    <div className="p-3 rounded-md text-sm bg-gray-50 h-16 flex items-center justify-center">
                        <p>{error}</p>
                    </div>
                )
            }
            {
                loading && (
                    <div className="space-y-2">
                        {
                            Array.from({length: 2}, (_, i: number) => {
                                return <Skeleton className="w-full h-16" key={i}/>
                            })
                        }
                    </div>

                )
            }
        </Section>
    )
}

export default BPJSUnit