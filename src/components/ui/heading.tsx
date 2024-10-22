"use client"
import React from "react";
import {cn} from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

const headingVariant = cva("mt-1 mb-4 ",{
    variants: {
        variant : {
            'page-title' : 'text-[#054571] font-bold',
            'section-title' : 'text-gray-800 font-semibold'
        },
        size :{
            h1: 'text-2xl md:text-3xl xl:text-4xl',
            h2: 'text-xl md:text-2xl xl:text-3xl',
            h3: 'text-2xl',
            h4: 'text-xl',
            h5: 'text-lg',
            h6: 'text-base',
        }
    },
    defaultVariants: {
        variant: 'section-title',
        size: 'h5'
    }
} )

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariant>{
    headingLevel : 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = ({ headingLevel = 'h5', children, className, variant }: HeadingProps) => {
    const {status} = useSession();
    const Headings = ({...props} :React.HTMLAttributes<HTMLHeadingElement> ) => React.createElement(headingLevel, props, children)
    const size = headingLevel
    return (
        <>
            {
                status === 'loading' ? (
                    <div className="h-[32px] mt-1 mb-4">
                        <Skeleton className="h-6 w-1/2 sm:w-1/3"/>
                    </div>
                ): (
                    <Headings className={cn(headingVariant({variant, size, className}))}>{children}</Headings>
                )
            }
        </>
    )
}

export default Heading