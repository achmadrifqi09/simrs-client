"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {PatientType as PatientProps} from "@/types/patient";
import {Action} from "@/enums/action";
import PatientTable from "@/app/(root)/patient/patient-table";
import PatientDelete from "@/app/(root)/patient/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Patient = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<PatientProps | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [PatientPermission, setPatientPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('data-pasien');
        if (permission) setPatientPermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Pasien</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        PatientPermission?.can_view && (
                            <PatientTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={PatientPermission}
                            />
                        )
                    }
                    {
                        PatientPermission?.can_delete && (
                            <PatientDelete
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setShowAlert={setShowAlertDelete}
                                showAlert={showAlertDelete}
                                actionType={actionType}/>
                        )
                    }
                </div>
            </Section>
        </>
    )
}

export default Patient
