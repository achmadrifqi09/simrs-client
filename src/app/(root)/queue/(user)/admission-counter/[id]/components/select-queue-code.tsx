import React, {useEffect, useState} from 'react';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import Cookies from "js-cookie";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Label} from "@/components/ui/label";
import {Tickets} from "lucide-react";

interface SelectQueueCodeProps {
    setQueueCode: React.Dispatch<React.SetStateAction<string>>;
    onResetSkippedQueue: () => void;
}

const SelectQueueCode = ({setQueueCode, onResetSkippedQueue}: SelectQueueCodeProps) => {
    const [code, setCode] = useState<string>("");
    const [showSelect, setShowSelect] = useState<boolean>(false);
    const handleSelect = () => {
        Cookies.set('ADMISSION_QUEUE_CODE', code);
        setQueueCode(code)
        setShowSelect(false);
        onResetSkippedQueue()
    }

    useEffect(() => {
        const cookieCode = Cookies.get('ADMISSION_QUEUE_CODE')
        if (cookieCode) {
            setCode(cookieCode)
            setQueueCode(cookieCode)
        }
    }, [])

    return (
        <>
            <Popover onOpenChange={setShowSelect} open={showSelect}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className={!code ? 'animate-pulse' : ''}>
                        <Tickets className="w-4 h-4 mr-2"/>
                        Pilih kode antrean
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 ml-4 md:ml-0">
                    <Label>Pilih kode antrean</Label>
                    <div className="flex items-center gap-4 mt-1.5">
                        <Select value={code} onValueChange={setCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kode antrean"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end">
                            <Button onClick={handleSelect}>
                                Pilih
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default SelectQueueCode