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

type CounterDTO = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    status: number;
    keterangan: string | undefined;
    jenis_loket: number;
}


const Counter = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<CounterDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [provincePermission, setProvincePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('master-loket-antrean');
        if (permission) setProvincePermission(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Master Loket Antrean</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateCounter
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={provincePermission}
                    />
                    <CounterTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={provincePermission}
                    />
                    <DeleteCounter
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

export default Counter
