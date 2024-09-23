"use client"
import React, {ReactNode} from "react";
import {TopBar} from "@/components/ui/top-bar";
import {Navigation} from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import DynamicBreadcrumb from "@/components/ui/dynamic-breadcrumb";
import {AppProgressBar as ProgressBar} from "next-nprogress-bar"


const DashboardLayout = ({children}: { children: ReactNode }) => {

    return (
        <>
            <ProgressBar
                height="5px"
                color="#F1A7AC"
                options={{ showSpinner: false }}
                shallowRouting
            />
            <div className="w-screen h-dvh overflow-hidden">
                <TopBar/>
                <div className="flex h-content overflow-hidden">
                    <Navigation/>
                    <div className="main-wrapper overflow-hidden">
                        <main className="p-4 md:p-6 flex-1 main">
                            <DynamicBreadcrumb/>
                            {children}
                        </main>
                        <Footer/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout