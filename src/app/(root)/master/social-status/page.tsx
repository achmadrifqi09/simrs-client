"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {SocialStatusDTO} from "@/types/master";
import {Action} from "@/enums/action";
import SocialStatusTable from "@/app/(root)/master/social-status/social-status-table";
import UpdateOrCreateSocialStatus from "@/app/(root)/master/social-status/update-or-create";
import DeleteSocialStatus from "@/app/(root)/master/social-status/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const SocialStatus = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<SocialStatusDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [socialStatusPermission, setSocialStatusPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('status-sosial');
        if(permission) setSocialStatusPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Status Sosial</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateSocialStatus
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={socialStatusPermission}
                    />
                    <SocialStatusTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={socialStatusPermission}
                    />
                    <DeleteSocialStatus
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

export default SocialStatus
