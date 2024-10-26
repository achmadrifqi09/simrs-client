"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {RoomType} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateRoomType from "@/app/(root)/room/type/update-or-create";
import RoomTypeTable from "@/app/(root)/room/type/room-type-table";
import RoomTypeDelete from "@/app/(root)/room/type/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const RoomType = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RoomType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomTypePermission, setRoomTypePermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('jenis-kamar');
        if(permission) setRoomTypePermission(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Jenis Kamar</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateRoomType
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={roomTypePermission}
                    />
                    <RoomTypeTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={roomTypePermission}
                    />
                    <RoomTypeDelete
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

export default RoomType
