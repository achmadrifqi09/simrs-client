"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Regency as RegencyType} from "@/types/master";
import {Action} from "@/enums/action";
import UpdateOrCreateRegency from "@/app/(root)/master/regency/update-or-create-regency";
import RegencyTable from "@/app/(root)/master/regency/regency-table";
import RegencyDelete from "@/app/(root)/master/regency/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Regency = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<RegencyType | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [regencyPermission, setRegenecyPermission] = useState<Permission | null>(null)
    const {getPermissions} = usePermissionsStore();
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('kabupaten-kota');
        if(permission) setRegenecyPermission(permission);
    }, []);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Kabupaten / Kota</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        regencyPermission?.can_create && (
                            <UpdateOrCreateRegency
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                            />
                        )
                    }
                    {
                        regencyPermission?.can_view && (
                            <RegencyTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={regencyPermission}
                            />
                        )
                    }
                    {
                        regencyPermission?.can_delete && (
                            <RegencyDelete
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

export default Regency
