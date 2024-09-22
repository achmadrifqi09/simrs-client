import React from "react";
import {cn} from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const headingVariant = cva("mt-1 font-semibold mb-4 ",{
    variants: {
        variant : {
            'page-title' : 'text-[#054571]',
            'section-title' : 'text-gray-800'
        },
        size :{
            h1: 'text-4xl',
            h2: 'text-3xl',
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
    const Headings = ({...props} :React.HTMLAttributes<HTMLHeadingElement> ) => React.createElement(headingLevel, props, children)
    const size = headingLevel
    return <Headings className={cn(headingVariant({variant, size, className}))}>{children}</Headings>
}

export default Heading