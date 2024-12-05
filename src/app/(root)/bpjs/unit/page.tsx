"use client"
import Heading from "@/components/ui/heading";
import BPJSUnit from "@/app/(root)/bpjs/unit/components/bpjs-unit";
import InternalUnit from "@/app/(root)/bpjs/unit/components/internal-unit";

const Unit = () => {
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Unit BPJS</Heading>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                <BPJSUnit/>
                <InternalUnit/>
            </div>
        </>
    )
}

export default Unit