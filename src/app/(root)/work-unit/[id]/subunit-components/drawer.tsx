"use client"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Permission} from "@/types/permission";
import {Subunit, WorkUnit} from "@/types/work-unit";
import {Action} from "@/enums/action";
import {usePermissionsStore} from "@/lib/zustand/store";
import SubunitUpdateOrCreate from "@/app/(root)/work-unit/[id]/subunit-components/update-or-create";
import SubunitTable from "@/app/(root)/work-unit/[id]/subunit-components/subunit-table";
import {XIcon} from "lucide-react";
import DeleteSubunit from "@/app/(root)/work-unit/[id]/subunit-components/delete-subunit";

type SubunitDrawerProps = {
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    permission: Permission | null;
    selectRecord: WorkUnit | null,
    fieldId: number
}

const SubunitDrawer = ({drawerOpen, setDrawerOpen, selectRecord: workUnit, fieldId}: SubunitDrawerProps) => {
    const [selectedRecord, setSelectedRecord] = useState<Subunit | null>(null);
    const [subunitAction, setSubunitAction] = useState<Action>(Action.VIEW);
    const [workUnitPermission, setWorkUnitPermission] = useState<Permission | null>(null);
    const [subunitDeleteAlert, setSubunitDeleteAlert] = useState<boolean>(false);
    const {getPermissions} = usePermissionsStore();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSubunitAction(Action.VIEW)
    }

    useEffect(() => {
        const permission = getPermissions('unit-kerja');
        if (permission) setWorkUnitPermission(permission)
    }, [fieldId])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    return (
        <Drawer open={drawerOpen} onOpenChange={handleCloseDrawer}>
            <DrawerContent>
                <DrawerHeader className="pt-2 mb-0 pb-0 px-6">
                    <DrawerTitle>
                        <div
                            className="max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full text-xl flex justify-between">
                            Subunit {workUnit?.nama_unit_kerja}
                            <Button variant="ghost" size="icon" className="text-gray-600"
                                    onClick={() => setDrawerOpen(false)}>
                                <XIcon/>
                            </Button>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    {
                        drawerOpen && (
                            <div
                                className="max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full h-[82dvh] md:h-[74dvh] border-box">
                                <div className="flex gap-2 px-2">
                                    {
                                        (subunitAction !== Action.VIEW
                                            && subunitAction !== Action.UPDATE_STATUS
                                            && subunitAction !== Action.UPDATE_QUEUE_STATUS
                                        ) && (
                                            <Button onClick={() => setSubunitAction(Action.VIEW)} variant="outline" size="sm">
                                                Kembali
                                            </Button>
                                        )
                                    }
                                    {
                                        (subunitAction === Action.VIEW
                                            || subunitAction === Action.UPDATE_STATUS
                                            || subunitAction === Action.UPDATE_QUEUE_STATUS
                                        ) && (
                                            <Button onClick={() => setSubunitAction(Action.CREATE)} size="sm">
                                                Tambah Subunit
                                            </Button>
                                        )
                                    }

                                </div>
                                <div className="h-[76dvh] md:h-[68dvh] overflow-y-auto px-2">
                                    {(subunitAction !== Action.CREATE && subunitAction !== Action.UPDATE_FIELDS) && (
                                        <SubunitTable
                                            action={subunitAction}
                                            fieldId={fieldId} parentUnit={workUnit}
                                            permission={workUnitPermission}
                                            selectRecord={setSelectedRecord}
                                            setAction={setSubunitAction}
                                            selectedRecord={selectedRecord}
                                            setShowAlert={setSubunitDeleteAlert}
                                            refreshTrigger={refreshTrigger}
                                        />
                                    )}
                                    {(subunitAction === Action.CREATE || subunitAction === Action.UPDATE_FIELDS) && (
                                        <SubunitUpdateOrCreate
                                            parentUnit={workUnit}
                                            action={subunitAction}
                                            fieldId={fieldId}
                                            setAction={setSubunitAction}
                                            selectedRecord={selectedRecord}
                                        />
                                    )}
                                    {
                                        subunitAction === Action.DELETE && (
                                            <DeleteSubunit
                                                selectedRecord={selectedRecord}
                                                showAlert={subunitDeleteAlert}
                                                setShowAlert={setSubunitDeleteAlert}
                                                onRefresh={onRefresh}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

export default SubunitDrawer;