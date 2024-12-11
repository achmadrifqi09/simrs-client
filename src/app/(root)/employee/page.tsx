"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Employee as EmployeeType} from "@/types/employee";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import EmployeeTable from "@/app/(root)/employee/employee-table";
import EmployeeDelete from "@/app/(root)/employee/delete";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Employee = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<EmployeeType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [employeePermission, setProvincePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('data-pegawai');
        if (permission) setProvincePermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Pegawai</Heading>
            <Section>
                <div className="gap-2 space-x-4 mb-4">
                    {
                        employeePermission?.can_create && (
                            <Button asChild>
                                <Link href={`/employee/form?action=create`}>Tambah Pegawai</Link>
                            </Button>
                        )
                    }
                </div>
                <div className="space-y-6">
                    {
                        employeePermission?.can_update && (
                            <EmployeeTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                action={actionType}
                                permission={employeePermission}
                                onRefresh={onRefresh}/>
                        )
                    }
                    {
                        employeePermission?.can_delete && (
                            <EmployeeDelete
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

export default Employee
