"use client"
import React, {ReactNode, useState} from "react";
import TopBar from "@/components/ui/top-bar";
import {Navigation} from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import DynamicBreadcrumb from "@/components/ui/dynamic-breadcrumb";
import {AppProgressBar as ProgressBar} from "next-nprogress-bar"
import {usePathname} from "next/navigation";
import {routeWithoutPanelLayout} from "@/const/route-without-panel-layout";


const PanelLayout = ({children}: { children: ReactNode }) => {
    const pathName = usePathname();
    const [show, setShow] = useState<boolean>(true);

    const handleShowMenu = () => setShow(prev => !prev);
    const checkingPath = routeWithoutPanelLayout.some(path => pathName.includes(path));

    if (checkingPath) {
        return (
            <>
                <ProgressBar
                    height="5px"
                    color="#F1A7AC"
                    options={{showSpinner: false}}
                    shallowRouting
                />
                {children}
            </>
        );
    }

    return (
        <>
            <ProgressBar
                height="5px"
                color="#F1A7AC"
                options={{showSpinner: false}}
                shallowRouting
            />
            <div className="w-screen h-dvh overflow-hidden">
                <TopBar onToggleMenu={handleShowMenu}/>
                <div className="flex h-content overflow-hidden">
                    <Navigation show={show}/>
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
    );
};


export default PanelLayout