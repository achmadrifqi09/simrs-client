"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {District as DistrictType} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateDistrict from "@/app/(root)/master/district/update-or-create";
import DistrictTable from "@/app/(root)/master/district/district-table";
import DistrictDelete from "@/app/(root)/master/district/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const District = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<DistrictType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [districtPermission, setDistrictPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('kecamatan')
        if (permission) setDistrictPermission(permission);
    }, []);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Kecamatan</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        districtPermission?.can_create && (
                            <UpdateOrCreateDistrict
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                            />
                        )
                    }
                    {
                        districtPermission?.can_view && (
                            <DistrictTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={districtPermission}
                            />
                        )
                    }
                    {
                        districtPermission?.can_delete && (
                            <DistrictDelete
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

export default District
