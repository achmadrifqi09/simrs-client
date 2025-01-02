import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { generateSignature } from '@/lib/crypto-js/cipher';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { PatientReferences, Reference } from '@/types/patient-reference';
import { Skeleton } from '@/components/ui/skeleton';

interface SelectReferenceProps {
    openSelectDialog: boolean;
    setSelectDialog: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectReference: (referenceNumber: string, referenceDate: string) => void;
    BPJSNumber?: string | undefined;
}
const SelectReference = ({
    openSelectDialog,
    setSelectDialog,
    onSelectReference,
    BPJSNumber,
}: SelectReferenceProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const [references, setRefreces] = useState<PatientReferences | null>();
    const fetchRerence = async () => {
        setLoading(true);
        try {
            const response: AxiosResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/bpjs/v-claim/participant/${BPJSNumber}`,
                {
                    headers: {
                        'client-signature': generateSignature(),
                        'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setRefreces(response?.data?.data);
            }
        } catch (error: any) {
            toast({
                title: 'Terjadi kesalahan',
                description: error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (openSelectDialog && BPJSNumber) {
            fetchRerence().catch(() => {
                toast({
                    title: 'Terjadi kesalahan',
                    description: 'Terjadi kesalahan saat mencari rujukan',
                });
            });
        }
        if (!BPJSNumber) {
            toast({
                title: 'Terjadi kesalahan',
                description: 'Nomor BPJS tidak ditemukan',
            });
        }
    }, [openSelectDialog]);

    return (
        <Dialog open={openSelectDialog} onOpenChange={setSelectDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pilih Rujukan Pasien BPJS</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    {!loading && (
                        <ul className="space-y-4">
                            {references?.rujukan?.map((reference: Reference, i: number) => {
                                return (
                                    <li
                                        className="bg-gray-50 w-full px-2 py-2.5 rounded-md flex justify-between items-center"
                                        key={i}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{reference.provPerujuk?.nama}</p>
                                            <p className="text-sm text-gray-500">
                                                {reference?.noKunjungan} - {reference.tglKunjungan}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="py-1.5"
                                            onClick={() =>
                                                onSelectReference(reference.noKunjungan, reference?.tglKunjungan)
                                            }
                                        >
                                            Pilih
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {loading && (
                        <div className="space-y-2">
                            {Array.from({ length: 2 }, (_, i: number) => {
                                return <Skeleton className="w-full h-16" key={i} />;
                            })}
                        </div>
                    )}
                    {references?.rujukan?.length === 0 && (
                        <div className="bg-gray-50 w-full px-2 py-2.5 rounded-md flex justify-between items-center">
                            <p className="text-sm text-gray-500">Data rujukan tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SelectReference;
