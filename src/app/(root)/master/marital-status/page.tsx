"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {MaritalStatusDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateMaritalStatus from "@/app/(root)/master/marital-status/update-or-create";
import MaritalStatusTable from "@/app/(root)/master/marital-status/marital-status-table";
import DeleteMaritalStatus from "@/app/(root)/master/marital-status/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const MaritalStatus = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<MaritalStatusDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [maritalStatusPermission, setProvincePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('provinsi');
        if(permission) setProvincePermission(permission)
    }, [])
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Status Perkawinan</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateMaritalStatus
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={maritalStatusPermission}
                    />
                    <MaritalStatusTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={maritalStatusPermission}
                    />
                    <DeleteMaritalStatus
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

export default MaritalStatus
