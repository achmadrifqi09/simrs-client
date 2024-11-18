import SelectSearch from "@/components/ui/select-search";
import React, {useState} from "react";
import {QueueUnit} from "@/types/outpatient";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";

interface SearchPolyProps {
    selected: string | number;
    onSelect: React.Dispatch<React.SetStateAction<string | number>>;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    clearTrigger: number;
    setClearTrigger: React.Dispatch<React.SetStateAction<number>>;
    onRefresh: () => void;
}

const SearchPoly = ({
                        selected,
                        onSelect,
                        clearTrigger,
                        setClearTrigger,
                        onRefresh
                    }: SearchPolyProps) => {
    const [queueUnit, setQueueUnit] = useState<string | number>(selected || "");

    return (
        <>
            <div className="flex gap-2">
                <div className="w-full lg:w-1/3">
                    <SelectSearch<QueueUnit>
                        url="/work-unit/queue-unit"
                        labelName="nama_unit_kerja"
                        valueName="kode_instalasi_bpjs"
                        onChange={(value: string | number | null) => onSelect(value || '')}
                        defaultValue={queueUnit}
                        clearTrigger={clearTrigger}
                    />
                </div>
                <Button
                    size="icon"
                    variant="outline"
                    className="border-gray-200 py-4"
                    onClick={() => {
                        setQueueUnit('');
                        setClearTrigger(clearTrigger + 1)
                        onRefresh()
                    }}>
                    <X className="text-gray-400 hover:text-red-600"/>
                </Button>
            </div>
        </>
    )
}

export default SearchPoly
