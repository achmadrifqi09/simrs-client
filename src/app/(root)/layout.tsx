'use client';
import React, {ReactNode, useEffect, useState} from 'react';
import TopBar from '@/components/ui/top-bar';
import {Navigation} from '@/components/ui/navigation';
import Footer from '@/components/ui/footer';
import DynamicBreadcrumb from '@/components/ui/dynamic-breadcrumb';
import {AppProgressBar as ProgressBar} from 'next-nprogress-bar';
import {usePathname} from 'next/navigation';
import {routeWithoutPanel} from '@/const/routeWithoutPanel';
import {useSession} from 'next-auth/react';
import {fetcher} from '@/utils/fetcher';
import {isAxiosError} from "axios";
import {toast} from "@/hooks/use-toast";
import {Menu} from "@/types/menu-type";
import {LAST_FETCH_KEY, MENU_CACHE_KEY} from "@/const/menu";

const PanelLayout = ({children}: { children: ReactNode }) => {
    const pathName = usePathname();
    const [show, setShow] = useState<boolean>(true);
    const checkingPath = routeWithoutPanel.some((path) => pathName.includes(path));
    const {data: session, status} = useSession();
    const [menus, setMenus] = useState<Menu[]>();

    useEffect(() => {
        const fetchMenus = async () => {
            if (session?.user?.id && session?.accessToken) {
                const cachedMenus = localStorage.getItem(MENU_CACHE_KEY);
                const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
                const now = new Date();
                if (cachedMenus && lastFetch && (now.getTime() - new Date(lastFetch).getTime() < 60 * 60 * 1000)) {
                    setMenus(JSON.parse(cachedMenus));
                } else {
                    try {
                        const fetchedMenus = await fetcher(`/menu/user/${session.user.id}`, session.accessToken);
                        setMenus(fetchedMenus);
                        if (localStorage) {
                            localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(fetchedMenus));
                            localStorage.setItem(LAST_FETCH_KEY, now.toISOString());
                        }
                    } catch (error) {
                        if (isAxiosError(error)) {
                            toast({
                                description: error?.message,
                            });
                        }
                        if (cachedMenus) {
                            setMenus(JSON.parse(cachedMenus));
                        }
                    }
                }
            }
        };

        fetchMenus().catch(() => {
            toast({description: 'Gagal mendapatkan data menu'})
        });
    }, [session]);

    const handleShowMenu = () => setShow((prev) => !prev);

    if (checkingPath || status === 'unauthenticated') {
        return (
            <>
                <ProgressBar height="5px" color="#F1A7AC" options={{showSpinner: false}} shallowRouting/>
                {children}
            </>
        );
    }

    return (
        <>
            <ProgressBar height="5px" color="#F1A7AC" options={{showSpinner: false}} shallowRouting/>
            <div className="w-screen h-dvh overflow-hidden">
                <TopBar onToggleMenu={handleShowMenu} menus={menus || []}/>
                <div className="flex h-content overflow-hidden">
                    <Navigation show={show} menus={menus || []}/>
                    <div className="main-wrapper overflow-hidden">
                        <main className="p-4 md:p-6 flex-1 main shadow-inner">
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

export default PanelLayout;