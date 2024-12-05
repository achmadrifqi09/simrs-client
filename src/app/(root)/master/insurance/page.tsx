"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Insurance} from "@/types/master";
import {Action} from "@/enums/action";
import InsuranceStatusTable from "@/app/(root)/master/insurance/insurance-table";
import UpdateOrCreateInsuranceStatus from "@/app/(root)/master/insurance/update-or-create";
import DeleteInsuranceStatus from "@/app/(root)/master/insurance/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const InsuranceStatus = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<Insurance | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [insuranceStatusPermission, setInsuranceStatusPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('asuransi');
        if(permission) setInsuranceStatusPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Asuransi</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        insuranceStatusPermission?.can_create && (
                            <UpdateOrCreateInsuranceStatus
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={insuranceStatusPermission}
                            />
                        )
                    }
                    {
                        insuranceStatusPermission?.can_view && (
                            <InsuranceStatusTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={insuranceStatusPermission}
                            />
                        )
                    }
                    {
                        insuranceStatusPermission?.can_delete && (
                            <DeleteInsuranceStatus
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

export default InsuranceStatus
