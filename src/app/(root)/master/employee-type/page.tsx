"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {EmployeeType} from "@/types/master";
import {Action} from "@/enums/action";
import EmployeeTypeTable from "@/app/(root)/master/employee-type/employee-type-table";
import UpdateOrCreateEmployeeType from "@/app/(root)/master/employee-type/update-or-create";
import EmployeeTypeDelete from "@/app/(root)/master/employee-type/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";


const EmployeeType = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<EmployeeType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [employeeTypePermission, setEmployeeTypePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('jenis-pegawai')
        if (permission) setEmployeeTypePermission(permission);
    }, []);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Jenis Pegawai</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        employeeTypePermission?.can_create && (
                            <UpdateOrCreateEmployeeType
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={employeeTypePermission}
                            />
                        )
                    }
                    {
                        employeeTypePermission?.can_view && (
                            <EmployeeTypeTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={employeeTypePermission}
                            />
                        )
                    }
                    {
                        employeeTypePermission?.can_delete && (
                            <EmployeeTypeDelete
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

export default EmployeeType
