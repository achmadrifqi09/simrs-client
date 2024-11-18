"use client";
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import UpdateOrCreateDoctorSchedule from "@/app/(root)/doctor-schedule/scheduling/update-or-create";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import PerPolyclinicTable from "@/app/(root)/doctor-schedule/scheduling/tables/schedule-table";
import {DoctorSchedule} from "@/types/doctor-schedule";
import SearchPoly from "@/app/(root)/doctor-schedule/scheduling/tables/search-poly";
import SearchDoctor from "@/app/(root)/doctor-schedule/scheduling/tables/search-doctor";
import {Button} from "@/components/ui/button";
import DeleteDoctorSchedule from "@/app/(root)/doctor-schedule/scheduling/delete";

const DoctorScheduling = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<DoctorSchedule | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [schedulingPermission, setSchedulingPermission] = useState<Permission | null>(null);
    const {status} = useSession();
    const {getPermissions} = usePermissionsStore();
    const [queueUnit, setQueueUnit] = useState<string | number>("");
    const [doctorId, setDoctorId] = useState<string | number>("");
    const [tabValue, setTabValue] = useState<string>('perpolyclinic');
    const [url, setUrl] = useState<string>('/doctor-schedule')
    const [clearTrigger, setClearTrigger] = useState<number>(0)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        setUrl(`/doctor-schedule`);
    }

    const handleTabValueChange = (value: string) => {
        setTabValue(value)
        setUrl(
            tabValue === 'perpolyclinic' ?
                `/doctor-schedule?poly_code=${queueUnit}`
                : `/doctor-schedule?doctor_id=${doctorId}`
        )
    }

    useEffect(() => {
        const permission = getPermissions('penjadwalan-dokter');
        if (permission) setSchedulingPermission(permission);
        setUrl(
            tabValue === 'perpolyclinic' ?
                `/doctor-schedule?poly_code=${queueUnit}`
                : `/doctor-schedule?doctor_id=${doctorId}`
        )
    }, [getPermissions, queueUnit, doctorId]);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Penjadwalan Dokter</Heading>
            <Section>

                {
                    schedulingPermission?.can_view && (
                        <Tabs
                            defaultValue={tabValue}
                            className="w-full"
                            onValueChange={(value) => {
                                handleTabValueChange(value)
                                onRefresh();
                            }}
                        >
                            {status === 'loading' ? (
                                <div className="flex items-center justify-between">
                                    <Skeleton className="w-24 h-10"/>

                                </div>
                            ) : (
                                <div
                                    className="flex md:justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                                    <div>
                                        <Button onClick={() => {
                                            setOpenDrawer(true);
                                            setActionType(Action.CREATE)
                                        }}>
                                            Tambah Jadwal
                                        </Button>

                                        <UpdateOrCreateDoctorSchedule
                                            onRefresh={onRefresh}
                                            selectedRecord={selectedRecord}
                                            setSelectedRecord={setSelectedRecord}
                                            actionType={actionType}
                                            openDrawer={openDrawer}
                                            setOpenDrawer={setOpenDrawer}/>

                                        <DeleteDoctorSchedule
                                            onRefresh={onRefresh}
                                            selectedRecord={selectedRecord}
                                            actionType={actionType}
                                            showAlert={showAlertDelete}
                                            setShowAlert={setShowAlertDelete}
                                        />
                                    </div>
                                    <TabsList>
                                        <TabsTrigger
                                            value="perpolyclinic"
                                            className="leading-relaxed hover:cursor-pointer">
                                            Jadwal Perpoliklinik
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="perdoctor"
                                            className="leading-relaxed hover:cursor-pointer">
                                            Jadwal Perdokter
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            )}
                            <TabsContent value="perpolyclinic">
                                <div className="mt-6 space-y-4">
                                    {
                                        status === 'loading' ? (
                                            <Skeleton className="w-1/4 h-10"/>
                                        ) : (
                                            <SearchPoly
                                                setClearTrigger={setClearTrigger}
                                                clearTrigger={clearTrigger}
                                                selected={queueUnit}
                                                onSelect={setQueueUnit}
                                                setUrl={setUrl}
                                                onRefresh={onRefresh}/>
                                        )
                                    }

                                </div>
                            </TabsContent>
                            <TabsContent value="perdoctor">
                                <div className="mt-6 space-y-4">
                                    {
                                        status === 'loading' ? (
                                            <Skeleton className="w-1/3 h-4"/>
                                        ) : (
                                            <SearchDoctor
                                                selected={doctorId}
                                                onSelect={setDoctorId} clearTrigger={clearTrigger}
                                                setClearTrigger={setClearTrigger}
                                                onRefresh={onRefresh}/>
                                        )
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    )
                }

                <div className="mt-6 space-y-4">
                    <PerPolyclinicTable
                        refreshTrigger={refreshTrigger}
                        selectRecord={setSelectedRecord}
                        setAction={setActionType}
                        setAlertDelete={setShowAlertDelete}
                        permission={schedulingPermission}
                        url={url}
                        setOpenDrawer={setOpenDrawer}
                    />
                </div>
            </Section>
        </>
    );
}

export default DoctorScheduling;
