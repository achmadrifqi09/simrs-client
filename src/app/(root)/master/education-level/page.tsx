"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {EducationDTO} from "@/types/master";
import {Action} from "@/enums/action";
import EducationLevelTable from "@/app/(root)/master/education-level/education-level-table";
import UpdateOrCreateEducationLevel from "@/app/(root)/master/education-level/update-or-create";
import DeleteEducationLevel from "@/app/(root)/master/education-level/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const EducationLevel = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<EducationDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [educationLevelPermission, setEducationLevelPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('tingkat-pendidikan');
        if(permission) setEducationLevelPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Tingkat Pendidikan</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateEducationLevel
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={educationLevelPermission}
                    />
                    <EducationLevelTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={educationLevelPermission}
                    />
                    <DeleteEducationLevel
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

export default EducationLevel
