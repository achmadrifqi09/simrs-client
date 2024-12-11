import SelectSearch from "@/components/ui/select-search";
import React, {useState} from "react";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Employee} from "@/types/employee";

interface SearchDoctorProps {
    selected: string | number;
    onSelect: React.Dispatch<React.SetStateAction<string | number>>;
    clearTrigger: number;
    setClearTrigger: React.Dispatch<React.SetStateAction<number>>;
    onRefresh: () => void;
}

const SearchDoctor = ({
                          onSelect,
                          clearTrigger,
                          setClearTrigger,
                          onRefresh
                      }: SearchDoctorProps) => {
    const [doctorId, setDoctorId] = useState<string | number>("");

    return (
        <>
            <div className="flex gap-2">
                <div className="w-full lg:w-1/3">
                    <SelectSearch<Employee>
                        url="/employee/doctor"
                        labelName="nama_pegawai"
                        valueName="id_pegawai"
                        onChange={(value: string | number | null) => onSelect(value || '')}
                        defaultValue={doctorId}
                        clearTrigger={clearTrigger}
                    />
                </div>
                <Button
                    size="icon"
                    variant="outline"
                    className="border-gray-200 py-4"
                    onClick={() => {
                        onRefresh()
                        setDoctorId('');
                        setClearTrigger(clearTrigger + 1)
                    }}>
                    <X className="text-gray-400 hover:text-red-600"/>
                </Button>
            </div>
        </>
    )
}

export default SearchDoctor
