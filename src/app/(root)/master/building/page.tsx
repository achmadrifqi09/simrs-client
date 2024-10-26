"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Building} from "@/types/master";
import {Action} from "@/enums/action";
import BuildingTable from "@/app/(root)/master/building/building-table";
import UpdateOrCreateBuilding from "@/app/(root)/master/building/create-or-update";
import DeleteBuilding from "@/app/(root)/master/building/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Building = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<Building | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [buildingPermission, setBuildingPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('gedung');
        if(permission) setBuildingPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Building</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        buildingPermission?.can_create && (
                            <UpdateOrCreateBuilding
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={buildingPermission}
                            />
                        )
                    }
                    {
                        buildingPermission?.can_view && (
                            <BuildingTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={buildingPermission}
                            />
                        )
                    }
                    {
                        buildingPermission?.can_delete && (
                            <DeleteBuilding
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

export default Building
