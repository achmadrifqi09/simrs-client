"use client";
import Section from "@/components/ui/section";
import React, {useState} from "react";
import Heading from "@/components/ui/heading";
import RegisterTable from "@/app/(root)/register/onsite/register-table";

const Registration = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    return (
        <>
            <div className="flex flex-wrap justify-between mb-2">
                <Heading headingLevel="h3" variant="page-title">
                    Pendaftaran Onsite
                </Heading>
            </div>
            <div className="space-y-6">
                <Section>
                    <Heading headingLevel="h5">Pendaftar Layanan</Heading>
                    <RegisterTable
                        onRefresh={onRefresh}
                        refreshTrigger={refreshTrigger}
                    />

                </Section>
            </div>

        </>
    );
};

export default Registration;
