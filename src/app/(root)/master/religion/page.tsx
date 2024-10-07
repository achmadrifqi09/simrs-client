"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import {ReligionDTO} from "@/types/master";
import {Action} from "@/enums/action";
import ReligionTable from "@/app/(root)/master/religion/religion-table";
import UpdateOrCreateReligion from "@/app/(root)/master/religion/update-or-create";
import DeleteReligion from "@/app/(root)/master/religion/delete";

const Religion = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<ReligionDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Agama</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateReligion
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                    />
                    <ReligionTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                    />
                    <DeleteReligion
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

export default Religion