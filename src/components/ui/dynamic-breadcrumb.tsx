"use client";
import React, {useEffect, useState} from "react";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

const DynamicBreadcrumb = () => {
    const pathName = usePathname();
    const [pathNames, setPathNames] = useState<Array<string>>([]);
    const {status} = useSession();

    useEffect(() => {
        const handleBreadcrumbPath = () => {
            const paths = pathName.split("/");
            const result = paths.filter((path) => path !== "" && isNaN(Number(path)));
            setPathNames(result);
        };
        handleBreadcrumbPath();
    }, [pathName]);

    return (
        <>
            {
                status === "loading" ? (
                    <Skeleton className="h-[20px] w-1/3 md:w-1/6"/>
                ) : (
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathNames.map((path: string, index: number) => {
                                const cleanedPath = path.replace(/-/g, " ");
                                return (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                    <span
                                        className="capitalize"
                                    >
                                      {cleanedPath}
                                    </span>
                                        </BreadcrumbItem>
                                        {(index != pathNames.length - 1) && <BreadcrumbSeparator/>}
                                    </React.Fragment>
                                );
                            })}
                            {pathName === '/' && (
                                <BreadcrumbItem>
                                    <Link href="/" className="capitalize">
                                        Dashboard
                                    </Link>
                                </BreadcrumbItem>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                )
            }
        </>
    );
};

export default DynamicBreadcrumb;
