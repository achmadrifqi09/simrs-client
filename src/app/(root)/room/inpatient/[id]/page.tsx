"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {BedDTO} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateBed from "@/app/(root)/room/inpatient/[id]/update-or-create";
import BedTable from "@/app/(root)/room/inpatient/[id]/bed-table";
import BedDelete from "@/app/(root)/room/inpatient/[id]/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import {useParams, useSearchParams} from "next/navigation";

interface Params {
    id: string;
}

const Bed = () => {
    const searchParams = useSearchParams();
    const params = useParams() as unknown as Params;
    const id_params = params?.id;


    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<BedDTO | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [roomClassPermission, setBedPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('kelas-kamar');
        if (permission) setBedPermission(permission);
    }, [id_params]);
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Detail Kamar {searchParams.get('field_name') || ''}</Heading>
            <Section>
                <div className="space-y-6">
                    <UpdateOrCreateBed
                        onRefresh={onRefresh}
                        selectedRecord={selectedRecord}
                        setSelectedRecord={setSelectedRecord}
                        actionType={actionType}
                        permission={roomClassPermission}
                        id_params={id_params}
                    />
                    <BedTable
                        selectRecord={setSelectedRecord}
                        refreshTrigger={refreshTrigger}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={roomClassPermission}
                        action={actionType}
                    />
                    <BedDelete
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

export default Bed;
