"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {EmployeeCategoryDTO} from "@/types/master";
import {Action} from "@/enums/action";
import EmployeeCategoryTable from "@/app/(root)/master/employee-category/employee-category-table";
import UpdateOrCreateEmployeeCategory from "@/app/(root)/master/employee-category/update-or-create";
import EmployeeCategoryDelete from "@/app/(root)/master/employee-category/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";


const EmployeeCategory = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<EmployeeCategoryDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [employeeCategoryPermission, setEmployeeCategoryPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('kategori-pegawai')
        if(permission)  setEmployeeCategoryPermission(permission);
    }, []);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Kategori Pegawai</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateEmployeeCategory
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={employeeCategoryPermission}
                    />
                    <EmployeeCategoryTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={employeeCategoryPermission}
                    />
                    <EmployeeCategoryDelete
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

export default EmployeeCategory
