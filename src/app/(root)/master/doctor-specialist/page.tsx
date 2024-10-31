"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {DoctorSpecialist as DoctorSpecialistType} from "@/types/master";
import {Action} from "@/enums/action";
import DoctorSpecialistTable from "@/app/(root)/master/doctor-specialist/doctor-specialist-table";
import UpdateOrCreateDoctorSpecialist from "@/app/(root)/master/doctor-specialist/update-or-delete";
import DoctorSpecialistDelete from "@/app/(root)/master/doctor-specialist/delete";
import {Permission} from "@/types/permission"
import {usePermissionsStore} from "@/lib/zustand/store";

const DoctorSpecialist = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<DoctorSpecialistType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [doctorSpecialistPermission, setDoctorSpecialistPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('spesialis-dokter');
        if(permission) setDoctorSpecialistPermission(permission)
    }, []);
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Dokter Spesialis</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        doctorSpecialistPermission?.can_create && (
                            <UpdateOrCreateDoctorSpecialist
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={doctorSpecialistPermission}
                            />
                        )
                    }
                    {
                        doctorSpecialistPermission?.can_view && (
                            <DoctorSpecialistTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={doctorSpecialistPermission}
                            />
                        )
                    }
                    {
                        doctorSpecialistPermission?.can_delete && (
                            <DoctorSpecialistDelete
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

export default DoctorSpecialist
