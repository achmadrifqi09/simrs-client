"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {lazy, useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import {WorkUnit as WorkUnitType} from "@/types/work-unit";
import {Button} from "@/components/ui/button";
import WorkUnitTable from "@/app/(root)/work-unit/[id]/work-unit-table";
import UpdateOrCreateWorkUnit from "@/app/(root)/work-unit/[id]/update-or-create";
import {useParams, useSearchParams} from "next/navigation";
import Link from "next/link";
import DeleteWorkUnit from "@/app/(root)/work-unit/[id]/delete";

const SubunitDrawer = lazy(() => import("@/app/(root)/work-unit/[id]/subunit-components/drawer"));

type WorkUnitParams = {
    id: string;
}

const WorkUnit = () => {
    const param = useParams<WorkUnitParams>()
    const searchParams = useSearchParams()
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<WorkUnitType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [workUnitPermission, setWorkUnitPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const [showSubunit, setShowSubunit] = useState<boolean>(false);

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
                            fieldId={Number(param.id)}
                        />
                    </div>
                    <WorkUnitTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={workUnitPermission}
                        fieldId={Number(param.id)}
                        action={actionType}
                        setShowSubunit={setShowSubunit}
                    />
                    <DeleteWorkUnit
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        action={actionType}
                        setShowAlert={setShowAlertDelete}
                        showAlert={showAlertDelete}
                    />
                </div>
            </Section>

            <SubunitDrawer
                drawerOpen={showSubunit}
                setDrawerOpen={setShowSubunit}
                permission={workUnitPermission}
                selectRecord={selectedRecord}
                fieldId={Number(param.id)}
            />

        </>
    )
}

export default WorkUnit
