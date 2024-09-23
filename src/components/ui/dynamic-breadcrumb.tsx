"use client"
import React, {useEffect, useState} from "react"
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import {usePathname} from "next/navigation";
import Link from "next/link";

const DynamicBreadcrumb = () => {
    const pathName = usePathname();
    const [pathNames, setPathNames] = useState<Array<string>>([]);

    useEffect(() => {
        const handleBreadcrumbPath = () => {
            const paths = pathName.split("/")
            const result = paths.filter(path => path !== "")
            setPathNames(result)
        }
        handleBreadcrumbPath()
    }, [pathName])

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathNames.map((path: string, index: number) => {
                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <Link href={`/${pathNames.slice(0, index + 1).join('/')}`}
                                      className="capitalize">{path}</Link>
                            </BreadcrumbItem>
                            {index != pathNames.length - 1 && (<BreadcrumbSeparator/>)}
                        </React.Fragment>
                    )
                })}
                {pathNames.length === 0 && (
                    <BreadcrumbItem>
                        <Link href="/"
                              className="capitalize">Dashboard</Link>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default DynamicBreadcrumb;