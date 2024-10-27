"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {FamilyStatus as FamilyStatusType} from "@/types/master";
import {Action} from "@/enums/action";
import FamilyStatusTable from "@/app/(root)/master/family-status/family-status-table";
import UpdateOrCreateFamilyStatus from "@/app/(root)/master/family-status/update-or-create";
import DeleteFamilyStatus from "@/app/(root)/master/family-status/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const FamilyStatus = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<FamilyStatusType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [familyStatusPermission, setFamilyStatusPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('status-keluarga');
        if(permission) setFamilyStatusPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Status Keluarga</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        familyStatusPermission?.can_create && (
                            <UpdateOrCreateFamilyStatus
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={familyStatusPermission}
                            />
                        )
                    }
                    {
                        familyStatusPermission?.can_view && (
                            <FamilyStatusTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={familyStatusPermission}
                            />
                        )
                    }
                    {
                        familyStatusPermission?.can_delete && (
                            <DeleteFamilyStatus
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

export default FamilyStatus
