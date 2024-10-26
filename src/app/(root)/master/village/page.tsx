"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Village} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateVillage from "@/app/(root)/master/village/update-or-create";
import VillageTable from "@/app/(root)/master/village/village-table";
import VillageDelete from "@/app/(root)/master/village/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Village = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<Village | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [villagePermission, setVillagePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('kelurahan-desa');
        if(permission) setVillagePermission(permission);
    }, []);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Desa</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        villagePermission?.can_create && (
                            <UpdateOrCreateVillage
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                            />
                        )
                    }
                    {
                        villagePermission?.can_view && (
                            <VillageTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={villagePermission}
                            />
                        )
                    }
                    {
                        villagePermission?.can_delete && (
                            <VillageDelete
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                action={actionType}
                                setShowAlert={setShowAlertDelete}
                                showAlert={showAlertDelete}
                            />
                        )
                    }
                </div>
            </Section>
        </>
    )
}

export default Village
