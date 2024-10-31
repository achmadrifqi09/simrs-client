import type {EmployeeType} from "@/types/master";
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

type EmployeeTypeDeleteProps = {
    onRefresh: () => void,
    selectedRecord: EmployeeType | null,
    action: Action,
    showAlert: boolean,
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
}

const EmployeeTypeDelete = ({onRefresh, selectedRecord, action, showAlert, setShowAlert}: EmployeeTypeDeleteProps) => {
    const {deleteData, deleteError, deleteLoading} = useDelete(

    )
    const handleDelete = async () => {
        if(action === Action.DELETE){
            const result = await deleteData(`/master/employee-type/${selectedRecord?.id_ms_jenis_pegawai}`)

            if (result?.status_code === 200) {
                toast({
                    title: 'Delete Berhasil',
                    description: 'Berhasil manghapus data terkait',
                })
                onRefresh()
            }else{
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
                            Apakah anda yakin akan menghapus data Jenis Pegawai {selectedRecord?.nama_jenis_pegawai}?
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

export default EmployeeTypeDelete;
