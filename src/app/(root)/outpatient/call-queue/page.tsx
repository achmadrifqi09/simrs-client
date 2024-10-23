"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import CallQueueTable from "@/app/(root)/outpatient/call-queue/call-queue-table";

const OutpatientCallQueue = () => {

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Panggil Antrean Rawat Jalan</Heading>
            <Section>
                <Heading headingLevel="h4" variant="section-title">
                    Daftar Poliklinik
                </Heading>
                <CallQueueTable/>
            </Section>
        </>
    )
}

export default OutpatientCallQueue
