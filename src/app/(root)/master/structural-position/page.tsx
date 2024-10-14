"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {type StructuralPositionDTO} from "@/types/master";
import {Action} from "@/enums/action";
import StructuralPositionTable from "@/app/(root)/master/structural-position/structural-position-table";
import UpdateOrCreateStructuralPosition from "@/app/(root)/master/structural-position/update-or-create";
import DeleteStructuralPosition from "@/app/(root)/master/structural-position/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const StructuralPosition = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<StructuralPositionDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [structuralPositionPermission, setStructuralPositionPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('jabatan-struktural');
        if(permission) setStructuralPositionPermission(permission);
    }, []);
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Jabatan Struktural</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateStructuralPosition
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={structuralPositionPermission}
                    />
                    <StructuralPositionTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={structuralPositionPermission}
                    />
                    <DeleteStructuralPosition
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        action={actionType}
                        setShowAlert={setShowAlertDelete}
                        showAlert={showAlertDelete}
                    />
                </div>
            </Section>
        </>
    )
}

export default StructuralPosition
