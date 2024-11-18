import {Skeleton} from "@/components/ui/skeleton";
import Section from "@/components/ui/section";
import React from "react";

const CurrentQueueSkeleton = () => {
    return (
        <Section className="2xl:col-span-2">
            <Skeleton className="w-56 h-5 rounded mb-2"/>
            <Skeleton className="h-40 w-full mx-auto"/>

            <div className="mt-4 flex flex-wrap gap-2.5">
                <Skeleton className="h-10 w-20"/>
                <Skeleton className="h-10 w-32"/>
                <Skeleton className="h-10 w-20"/>
                <Skeleton className="h-10 w-24"/>
            </div>
        </Section>
    )
}

export default CurrentQueueSkeleton;