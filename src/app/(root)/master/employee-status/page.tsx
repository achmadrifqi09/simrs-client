"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {EmployeeStatusDTO} from "@/types/master";
import {Action} from "@/enums/action";
import EmployeeStatusTable from "@/app/(root)/master/employee-status/employee-status-table";
import UpdateOrCreateEmployeeStatus from "@/app/(root)/master/employee-status/update-or-create";
import EmployeeStatusDelete from "@/app/(root)/master/employee-status/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const EmployeeStatus = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<EmployeeStatusDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [employeeStatusPermission, setEmployeeStatusPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('status-pegawai');
        if(permission) setEmployeeStatusPermission(permission);
    }, []);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Status Pegawai</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateEmployeeStatus
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={employeeStatusPermission}
                    />
                    <EmployeeStatusTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={employeeStatusPermission}
                    />
                    <EmployeeStatusDelete
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

export default EmployeeStatus
