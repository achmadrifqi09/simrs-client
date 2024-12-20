"use client";
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Room as RoomType} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateRoom from "@/app/(root)/room/inpatient/update-or-create";
import RoomTable from "@/app/(root)/room/inpatient/room-table";
import RoomDelete from "@/app/(root)/room/inpatient/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Room = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRoomRecord, setSelectedRoomRecord] = useState<RoomType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomPermission, setRoomPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    useEffect(() => {
        const permission = getPermissions("kamar-dan-bed");
        if (permission) {
            setRoomPermission(permission);
        }
    }, []);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">
                Data Kamar
            </Heading>
            <Section>
                <div className="space-y-6">
                    {
                        roomPermission?.can_create && (
                            <UpdateOrCreateRoom
                                onRefresh={onRefresh}
                                selectedRecord={selectedRoomRecord}
                                setSelectedRecord={setSelectedRoomRecord}
                                actionType={actionType}
                                permission={roomPermission}
                            />
                        )
                    }
                    {
                        roomPermission?.can_view && (
                            <RoomTable
                                selectRecord={setSelectedRoomRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={roomPermission}
                            />
                        )
                    }
                    {
                        roomPermission?.can_delete && (
                            <RoomDelete
                                onRefresh={onRefresh}
                                selectedRecord={selectedRoomRecord}
                                action={actionType}
                                setShowAlert={setShowAlertDelete}
                                showAlert={showAlertDelete}
                            />
                        )
                    }
                </div>
            </Section>
        </>
    );
};

export default Room;
