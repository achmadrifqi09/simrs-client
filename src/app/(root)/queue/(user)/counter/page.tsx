"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import CounterTable from "@/app/(root)/queue/(user)/counter/counter-table";
import UpdateOrCreateCounter from "@/app/(root)/queue/(user)/counter/update-or-create";
import DeleteCounter from "@/app/(root)/queue/(user)/counter/delete";
import {Counter as CounterType} from '@/types/counter'

const Counter = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<CounterType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [counterPermission, setCounterPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('master-loket-antrean');
        if (permission) setCounterPermission(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Master Loket Antrean</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        counterPermission?.can_create && (
                            <UpdateOrCreateCounter
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={counterPermission}
                            />
                        )
                    }
                    {
                        counterPermission?.can_view && (
                            <CounterTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={counterPermission}
                            />
                        )
                    }
                    {
                        counterPermission?.can_delete && (
                            <DeleteCounter
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

export default Counter
