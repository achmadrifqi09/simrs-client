"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import UpdateOrCreateDoctorSchedule from "@/app/(root)/doctor-schedule/scheduling/update-or-create";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {Action} from "@/enums/action";
import {Permission} from "@/types/permission";
import {usePermissionsStore} from "@/lib/zustand/store";
import PerPolyclinicTable from "@/app/(root)/doctor-schedule/scheduling/tables/perpolyclinic";
import {DoctorSchedule} from "@/types/doctor-schedule";

const DoctorScheduling = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRecord, setSelectedRecord] = useState<DoctorSchedule | null>(null);
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);
    const [schedulingPermission, setSchedulingPermission] = useState<Permission | null>(null);
    const {status} = useSession()
    const {getPermissions} = usePermissionsStore();

    useEffect(() => {
        const permission = getPermissions('penjadwalan-dokter');
        if (permission) setSchedulingPermission(permission)
    }, [])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Penjadwalan Dokter</Heading>
            <Section>
                {
                    schedulingPermission?.can_view && (

                        <Tabs defaultValue="perpolyclinic" className="w-full">
                            {status === 'loading' ? (
                                <div className="flex items-center justify-between">
                                    <Skeleton className="w-24 h-10"/>
                                    <Skeleton className="w-1/4 h-10"/>
                                </div>
                            ) : (
                                <div
                                    className="flex md:justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                                    <UpdateOrCreateDoctorSchedule/>
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
                            )
                            }
                            <TabsContent value="perpolyclinic">
                                <div className="mt-6 space-y-4">
                                    <PerPolyclinicTable
                                        refreshTrigger={refreshTrigger}
                                        selectRecord={setSelectedRecord}
                                        setAction={setActionType}
                                        setAlertDelete={setShowAlertDelete}
                                        permission={schedulingPermission}/>
                                </div>
                            </TabsContent>
                            <TabsContent value="perdoctor">
                                <div className="mt-6 space-y-4">
                                    {
                                        status === 'loading' ? (
                                            <Skeleton className="w-1/3 h-4"/>
                                        ) : (
                                            <p className="text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet,
                                                consectetur
                                                adipisicing elit. A amet blanditiis dolorem pariatur quis!</p>
                                        )
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    )
                }
            </Section>
        </>
    )
}

export default DoctorScheduling
