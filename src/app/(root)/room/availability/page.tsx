"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {RoomDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateRoom from "@/app/(root)/room/availability/update-or-create";
import RoomTable from "@/app/(root)/room/availability/avaibility-table";
import RoomDelete from "@/app/(root)/room/availability/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Room = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RoomDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomPermission, setRoomPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    console.log(selectedRecord)
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('kamar-dan-inpatient');
        if (permission) setRoomPermission(permission)
        console.log(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Ketersediaan kamar</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateRoom
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={roomPermission}
                    />
                    <RoomTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={roomPermission}
                    />
                    <RoomDelete
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

export default Room
