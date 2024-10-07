"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import {DoctorSpecialistDTO} from "@/types/master";
import {Action} from "@/enums/action";
import DoctorSpecialistTable from "@/app/(root)/master/doctor-specialist/doctor-specialist-table";
import UpdateOrCreateDoctorSpecialist from "@/app/(root)/master/doctor-specialist/update-or-delete";
import DoctorSpecialistDelete from "@/app/(root)/master/doctor-specialist/delete";

const DoctorSpecialist = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<DoctorSpecialistDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Dokter Spesialis</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateDoctorSpecialist
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                    />
                    <DoctorSpecialistTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                    />
                    <DoctorSpecialistDelete
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

export default DoctorSpecialist
