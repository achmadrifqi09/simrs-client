"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {RoomClass as RoomClassType} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateRoomClass from "@/app/(root)/room/class/update-or-create";
import RoomClassTable from "@/app/(root)/room/class/room-class-table";
import RoomClassDelete from "@/app/(root)/room/class/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const RoomClass = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RoomClassType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomClassPermission, setRoomClassPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('kelas-kamar');
        if(permission) setRoomClassPermission(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Kelas Kamar</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        roomClassPermission?.can_create && (
                            <UpdateOrCreateRoomClass
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                                permission={roomClassPermission}
                            />
                        )
                    }
                    {
                        roomClassPermission?.can_view && (
                            <RoomClassTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={roomClassPermission}
                            />
                        )
                    }
                    {
                        roomClassPermission?.can_delete && (
                            <RoomClassDelete
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

export default RoomClass
