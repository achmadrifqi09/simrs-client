"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import {RankOrClassDTO} from "@/types/master";
import {Action} from "@/enums/action";
import RankOrClassTable from "@/app/(root)/master/employee-rank/rank-or-class-table";
import UpdateOrCreateRankOrClass from "@/app/(root)/master/employee-rank/update-or-create";
import RankOrClassDelete from "@/app/(root)/master/employee-rank/delete";

const RankOrClass = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RankOrClassDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Pangkat / Golongan</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateRankOrClass
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                    />
                    <RankOrClassTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                    />
                    <RankOrClassDelete
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

export default RankOrClass
