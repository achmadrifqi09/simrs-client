"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Religion as ReligionType} from "@/types/master";
import {Action} from "@/enums/action";
import ReligionTable from "@/app/(root)/master/religion/religion-table";
import UpdateOrCreateReligion from "@/app/(root)/master/religion/update-or-create";
import DeleteReligion from "@/app/(root)/master/religion/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Religion = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<ReligionType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [religionPermission, setReligionPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('agama');
        if (permission) setReligionPermission(permission);
    }, []);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Agama</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        religionPermission?.can_create && (
                            <UpdateOrCreateReligion
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={religionPermission}
                            />
                        )
                    }
                    {
                        religionPermission?.can_view && (
                            <ReligionTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={religionPermission}
                            />
                        )
                    }
                    {
                        religionPermission?.can_delete && (
                            <DeleteReligion
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

export default Religion
