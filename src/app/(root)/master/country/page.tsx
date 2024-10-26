"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {useEffect, useState} from "react";
import {Country} from "@/types/master";
import {Action} from "@/enums/action";
import CountryTable from "@/app/(root)/master/country/country-table";
import UpdateOrCreateCountry from "@/app/(root)/master/country/update-or-create";
import CountryDelete from "@/app/(root)/master/country/delete";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";

const Country = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<Country | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [countryPermission, setCountryPermission] = useState<Permission | null>(null);
    const {getPermissions} = usePermissionsStore();

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }

    useEffect(() => {
        const permission = getPermissions('negara')
        if(permission)  setCountryPermission(permission);
    }, []);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Data Master Negara</Heading>
            <Section>
                <div className="space-y-6">
                    {
                        countryPermission?.can_create && (
                            <UpdateOrCreateCountry
                                onRefresh={onRefresh}
                                selectedRecord={selectedRecord}
                                setSelectedRecord={setSelectedRecord}
                                actionType={actionType}
                            />
                        )
                    }
                    {
                        countryPermission?.can_view && (
                            <CountryTable
                                selectRecord={setSelectedRecord}
                                refreshTrigger={refreshTrigger}
                                setAction={setActionType}
                                setAlertDelete={setShowAlertDelete}
                                permission={countryPermission}
                            />
                        )
                    }
                    {
                        countryPermission?.can_delete && (
                            <CountryDelete
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

export default Country
