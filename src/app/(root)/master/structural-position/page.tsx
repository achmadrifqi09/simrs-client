"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import {type StructuralPositionDTO} from "@/types/master";
import {Action} from "@/enums/action";
import StructuralPositionTable from "@/app/(root)/master/structural-position/structural-position-table";
import UpdateOrCreateStructuralPosition from "@/app/(root)/master/structural-position/update-or-create";
import DeleteStructuralPosition from "@/app/(root)/master/structural-position/delete";

const StructuralPosition = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<StructuralPositionDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Jabatan Struktural</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateStructuralPosition
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                    />
                    <StructuralPositionTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                    />
                    <DeleteStructuralPosition
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

export default StructuralPosition