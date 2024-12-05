import {WorkUnit} from "@/types/work-unit";
import React, {useEffect, useRef, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ClipboardPaste, Loader2} from "lucide-react";
import {usePatch} from "@/hooks/use-patch";
import FormError from "@/components/ui/form-error";
import {toast} from "@/hooks/use-toast";

interface UpdateDialogProps {
    workUnit: WorkUnit | null;
    setWorkUnit: React.Dispatch<React.SetStateAction<WorkUnit | null>>;
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const UpdateDialog = ({workUnit, setWorkUnit, showDialog, setShowDialog, onRefresh}: UpdateDialogProps) => {
    const [BPJSUnitCode, setBPJSUnitCode] = useState<string | undefined>(workUnit?.kode_instalasi_bpjs);
    const inputRef = useRef<HTMLInputElement>(null);
    const {updateData, patchError, patchLoading} = usePatch()
    const handleCloseDialog = () => {
        setWorkUnit(null)
        setShowDialog(false)
    }

    const handleClipboardPaste = async () => {
        try {
            const code = await navigator.clipboard.readText();
            if (inputRef.current) {
                inputRef.current.value = code;
            }
            setBPJSUnitCode(code);
        } catch {
            toast({
                description: 'Gagal mendaptakan kode yang di copy'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBPJSUnitCode(e.target.value);
    }

    const handleUpdate = async () => {
        if (workUnit && workUnit.id) {
            const id: number = workUnit.id;
            delete workUnit.id;
            const response = await updateData(
                `/work-unit/${id}`,
                {
                    ...workUnit,
                    kode_instalasi_bpjs: BPJSUnitCode
                }
            )
            if (response.data) {
                setShowDialog(false)
                onRefresh()
                toast({
                    description: `Berhasil merubah kode ${workUnit.nama_unit_kerja}`,
                })
            }
        } else {
            toast({
                description: 'Anda belum memilih unit kerja'
            })
        }
    }

    useEffect(() => {
        if (workUnit) setBPJSUnitCode(workUnit.kode_instalasi_bpjs)
    }, [workUnit])


    return (
        <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {workUnit?.nama_unit_kerja}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Label className="mb-1">Kode BPJS</Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            ref={inputRef}
                            defaultValue={BPJSUnitCode || ""}
                            onChange={handleChange}/>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => inputRef && handleClipboardPaste()}>
                            <ClipboardPaste className="text-gray-500"/>
                        </Button>
                    </div>
                    <FormError errors={patchError}/>
                    <div className="flex justify-end mt-6">
                        <Button disabled={patchLoading} onClick={handleUpdate}>
                            {
                                patchLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDialog;