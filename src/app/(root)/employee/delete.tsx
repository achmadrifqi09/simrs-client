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
import {Employee} from "@/types/employee";

type DeleteEmployeeProps = {
    onRefresh: () => void,
    selectedRecord: Employee | null,
    action: Action,
    showAlert: boolean,
    setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteEmployee = ({
                                   onRefresh,
                                   selectedRecord,
                                   action,
                                   showAlert,
                                   setShowAlert
                               }: DeleteEmployeeProps) => {
    const {deleteData, deleteError, deleteLoading} = useDelete(

    )
    const handleDelete = async () => {
        if (action === Action.DELETE) {
            const result = await deleteData(`/employee/${selectedRecord?.id_pegawai}`)

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
                            Apakah anda yakin akan menghapus data Pegawai{"'"}{selectedRecord?.nama_pegawai}{"'"} ?
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

export default DeleteEmployee;
