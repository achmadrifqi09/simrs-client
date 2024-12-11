import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClipboardPaste, Loader2 } from 'lucide-react';
import { usePatch } from '@/hooks/use-patch';
import FormError from '@/components/ui/form-error';
import { toast } from '@/hooks/use-toast';
import { InternalDoctor } from '@/types/doctor-bpjs';

interface UpdateDialogProps {
    doctor: InternalDoctor | null;
    setDoctor: React.Dispatch<React.SetStateAction<InternalDoctor | null>>;
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const UpdateDialog = ({ doctor, setDoctor, showDialog, setShowDialog, onRefresh }: UpdateDialogProps) => {
    const [DPJPCode, setDPJPCode] = useState<string | undefined>(doctor?.kode_dpjp);
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateData, patchError, patchLoading } = usePatch();
    const handleCloseDialog = () => {
        setDoctor(null);
        setShowDialog(false);
    };

    const handleClipboardPaste = async () => {
        try {
            const code = await navigator.clipboard.readText();
            if (inputRef.current) {
                inputRef.current.value = code;
            }
            setDPJPCode(code);
        } catch {
            toast({
                description: 'Gagal mendaptakan kode yang di copy',
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDPJPCode(e.target.value);
    };

    const handleUpdate = async () => {
        if (doctor && doctor.id_pegawai) {
            const id: number = doctor.id_pegawai;
            const response = await updateData(`/employee/${id}/kode-dpjp`, {
                kode_dpjp: DPJPCode,
            });
            if (response.data) {
                setShowDialog(false);
                onRefresh();
                toast({
                    description: `Berhasil merubah kode DPJP ${doctor?.gelar_depan ? doctor?.gelar_depan + '. ' : ''} ${
                        doctor?.nama_pegawai
                    } ${doctor?.gelar_belakang ?? ''}`,
                });
            }
        } else {
            toast({
                description: 'Anda belum memilih unit kerja',
            });
        }
    };

    useEffect(() => {
        if (doctor) setDPJPCode(doctor.kode_dpjp);
    }, [doctor]);

    return (
        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit DPJP {doctor?.gelar_depan ? doctor?.gelar_depan + '. ' : ''} {doctor?.nama_pegawai}{' '}
                        {doctor?.gelar_belakang}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Label className="mb-1">Kode DPJP</Label>
                    <div className="flex gap-2">
                        <Input type="text" ref={inputRef} defaultValue={DPJPCode || ''} onChange={handleChange} />
                        <Button variant="ghost" size="icon" onClick={() => inputRef && handleClipboardPaste()}>
                            <ClipboardPaste className="text-gray-500" />
                        </Button>
                    </div>
                    <FormError errors={patchError} />
                    <div className="flex justify-end mt-6">
                        <Button disabled={patchLoading} onClick={handleUpdate}>
                            {patchLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading</span>
                                </>
                            ) : (
                                <span>Simpan</span>
                            )}
                        </Button>
                    </div>
                </div>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDialog;
