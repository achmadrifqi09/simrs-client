"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {RankOrClass} from "@/types/master";
import {Action} from "@/enums/action";
import EmployeeRankTable from "@/app/(root)/master/employee-rank/employee-rank-table";
import UpdateOrCreateRankOrClass from "@/app/(root)/master/employee-rank/update-or-create";
import RankOrClassDelete from "@/app/(root)/master/employee-rank/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const RankOrClass = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RankOrClass | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [rankOrClassPermission, setRankOrClassPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('pangkat-golongan')
        if (permission) setRankOrClassPermission(permission)
    }, []);
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Pangkat / Golongan</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        rankOrClassPermission?.can_create && (
                            <UpdateOrCreateRankOrClass
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={rankOrClassPermission}
                            />
                        )
                    }
                    {
                        rankOrClassPermission?.can_view && (
                            <EmployeeRankTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={rankOrClassPermission}
                            />
                        )
                    }
                    {
                        rankOrClassPermission?.can_delete && (
                            <RankOrClassDelete
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

export default RankOrClass
