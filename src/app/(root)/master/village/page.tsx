"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import {VillageDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateVillage from "@/app/(root)/master/village/update-or-create";
import VillageTable from "@/app/(root)/master/village/village-table";
import VillageDelete from "@/app/(root)/master/village/delete";

const Village = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const [selectedRecord, setSelectedRecord] = useState<VillageDTO | null>(null);

    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Desa</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateVillage
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                    />
                    <VillageTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                    />
                    <VillageDelete
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

export default Village
