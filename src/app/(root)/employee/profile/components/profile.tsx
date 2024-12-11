"use client"

import {useSearchParams} from "next/navigation";
import useGet from "@/hooks/use-get";
import {Employee} from "@/types/employee";

const Profile = () => {
    const searchParams = useSearchParams();
    const id_pegawai = Number(searchParams.get('id'));
    const {data} = useGet<Employee>({
        url: `/employee/${id_pegawai}`,
    });
    return (
        <>

            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mt-8 gap-4">
                {/* Kolom Kiri */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <p className="text-left">Nama</p>
                        <p className="text-left">{data?.nama_pegawai}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-left">NIP</p>
                        <p className="text-left">{data?.nip_pegawai}</p>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <p className="text-left">Email</p>
                        <p className="text-left">{data?.email}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-left">No KTP</p>
                        <p className="text-left">{data?.no_ktp}</p>
                    </div>
                </div>
            </div>


        </>
    )
}
export default Profile

