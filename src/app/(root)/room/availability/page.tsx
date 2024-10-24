"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {BedDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateAvailability from "@/app/(root)/room/availability/update-or-create";
import AvailabilityTable from "@/app/(root)/room/availability/avaibility-table";
import AvailabilityDelete from "@/app/(root)/room/availability/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Availability = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<BedDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomPermission, setAvailabilityPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('ketersediaan-kamar');
        if (permission) setAvailabilityPermission(permission)
    }, [])

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Ketersediaan kamar</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateAvailability
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={roomPermission}
                    />
                    <AvailabilityTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        permission={roomPermission}
                    />
                    <AvailabilityDelete
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

export default Availability
