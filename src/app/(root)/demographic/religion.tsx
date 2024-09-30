"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";

const Religion = () => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>("Tambah Data Agama");

    const handleOpenDialog = (dialogTitle: string) => {
        setShowDialog((prev) => !prev)
        setDialogTitle(dialogTitle)
    }

    const handleCloseDialog = () => {
        setShowDialog(false)
    }
    return (
        <>
            <Section>
                <Heading headingLevel="h5">Agama</Heading>
                <div>
                    <Button onClick={() => handleOpenDialog("Tambah Data Agama")}>Tambah Data</Button>
                </div>
            </Section>
            <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            Tambhakan data agama untuk karyawan dan pasien
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <div className="my-4">
                            <Label htmlFor="name" className="text-right">
                                Nama Agama
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                            />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="username" className="text-right">
                                Status
                            </Label>
                            <Input
                                id="username"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Religion