"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import FieldOfWorkUnitTable from "@/app/(root)/work-unit/field-work-unit-table";
import UpdateOrCreateFieldWorkUnit from "@/app/(root)/work-unit/update-or-create";
import DeleteFieldOfWorkUnit from "@/app/(root)/work-unit/delete";
import {FieldOfWorkUnit} from "@/types/work-unit";

const WorkUnit = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<FieldOfWorkUnit | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [workUnitPermission, setWorkUnitPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('unit-kerja');
        if (permission) setWorkUnitPermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Bidang Unit Kerja</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        workUnitPermission?.can_create && (
                            <UpdateOrCreateFieldWorkUnit
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={workUnitPermission}
                            />
                        )
                    }
                    {
                        workUnitPermission?.can_view && (
                            <FieldOfWorkUnitTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={workUnitPermission}
                                action={actionType}
                            />
                        )
                    }
                    {
                        workUnitPermission?.can_delete && (
                            <DeleteFieldOfWorkUnit
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

export default WorkUnit
