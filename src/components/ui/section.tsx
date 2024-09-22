import React from "react";
import {cn} from "@/lib/utils";


type sectionProps = React.ComponentProps<'section'> & {
    children?: React.ReactNode;
    className?: string;
}

const Section = (props: sectionProps) => {
    const baseClass = "p-4 border border-gray-200 rounded-xl";
    return (
        <div className={cn(baseClass, props.className)}>
            {props.children}
        </div>
    )
}

export default Section