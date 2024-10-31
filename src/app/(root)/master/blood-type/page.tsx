"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import UpdateOrCreateBloodType from "@/app/(root)/master/blood-type/update-or-create";
import {BloodType as BloodTypeProps} from "@/types/master";
import BloodTypeTable from "@/app/(root)/master/blood-type/blood-type-table";
import {Action} from "@/enums/action";
import BloodTypeDelete from "@/app/(root)/master/blood-type/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const BloodType = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<BloodTypeProps | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [bloodTypePermission, setProvincePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('golongan-darah');
        if (permission) setProvincePermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Golongan Darah</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        bloodTypePermission?.can_create && (
                            <UpdateOrCreateBloodType
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={bloodTypePermission}
                            />
                        )
                    }
                    {
                        bloodTypePermission?.can_view && (
                            <BloodTypeTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={bloodTypePermission}
                            />
                        )
                    }
                    {
                        bloodTypePermission?.can_delete && (
                            <BloodTypeDelete
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

export default BloodType
