"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {ProvinceDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateProvince from "@/app/(root)/master/province/update-or-create";
import ProvinceTable from "@/app/(root)/master/province/province-table";
import ProvinceDelete from "@/app/(root)/master/province/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Province = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<ProvinceDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [provincePermission, setProvincePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('provinsi');
        if(permission) setProvincePermission(permission)
        console.log(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Provinsi</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateProvince
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={provincePermission}
                    />
                    <ProvinceTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={provincePermission}
                    />
                    <ProvinceDelete
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

export default Province
