"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import {WorkUnit as WorkUnitType} from "@/types/work-unit";
import {Button} from "@/components/ui/button";
import WorkUnitTable from "@/app/(root)/work-unit/[id]/work-unit-table";
import UpdateOrCreateWorkUnit from "@/app/(root)/work-unit/[id]/update-or-create";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

const WorkUnit = () => {
    const searchParams = useSearchParams()
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<WorkUnitType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [workUnitPermission, setWorkUnitPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const [showFieldOfWorkUnit, setShowFieldOfWorkUnit] = useState<boolean>(false);
    useEffect(() => {
        const permission = getPermissions('unit-kerja');
        if (permission) setWorkUnitPermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Unit Kerja {searchParams.get('field_name') || ''}</Heading>

            <Section>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/work-unit">
                                Kembali
                            </Link>
                        </Button>
                        <UpdateOrCreateWorkUnit
                            onRefresh={onRefresh}
                            selectedRecord={selectedRecord}
                            setSelectedRecord={setSelectedRecord}
                            actionType={actionType}
                            permission={workUnitPermission}
                        />
                    </div>
                    <WorkUnitTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={workUnitPermission}
                        // action={actionType}
                    />
                    {/*<BloodTypeDelete*/}
                    {/*    onRefresh={onRefresh}*/}
                    {/*    selectedRecord={selectedRecord}*/}
                    {/*    action={actionType}*/}
                    {/*    setShowAlert={setShowAlertDelete}*/}
                    {/*    showAlert={showAlertDelete}*/}
                    {/*/>*/}
                </div>
            </Section>
            {/*<FieldOfWorkUnit*/}
            {/*    show={showFieldOfWorkUnit}*/}
            {/*    setShow={setShowFieldOfWorkUnit}*/}
            {/*    permission={workUnitPermission}*/}
            {/*/>*/}
        </>
    )
}

export default WorkUnit
