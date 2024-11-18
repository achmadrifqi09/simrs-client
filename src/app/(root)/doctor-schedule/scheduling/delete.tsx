import type {DoctorSchedule} from "@/types/doctor-schedule";
import React from "react";
import {Action} from "@/enums/action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {toast} from "@/hooks/use-toast";
import {useDelete} from "@/hooks/use-delete";
import {Loader2} from "lucide-react";

type DeleteDoctorScheduleProps = {
    onRefresh: () => void,
    selectedRecord: DoctorSchedule | null,
    actionType: Action,
    showAlert: boolean,
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteDoctorSchedule = ({
                                  onRefresh,
                                  selectedRecord,
                                  actionType,
                                  showAlert,
                                  setShowAlert
                              }: DeleteDoctorScheduleProps) => {
    const {deleteData, deleteError, deleteLoading} = useDelete(

    )
    const handleDelete = async () => {
        if (actionType === Action.DELETE) {
            const result = await deleteData(`/doctor-schedule/${selectedRecord?.id_jadwal_dokter}`)

            if (result?.status_code === 200) {
                toast({
                    title: 'Delete Berhasil',
                    description: 'Berhasil manghapus data terkait',
                })
                onRefresh()
            } else {
                toast({
                    title: 'Delete Gagal',
                    description: deleteError?.toString(),
                })
            }
        }
    }

    return (
        <>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Peringatan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah anda yakin akan menghapus data Jadwal Dokter dengan
                            {selectedRecord?.id_pegawai}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batalkan</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {
                                deleteLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <span>Ya, lanjutkan</span>
                                )
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default DeleteDoctorSchedule;
