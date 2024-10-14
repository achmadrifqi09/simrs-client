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
import {toast} from "@/hooks/use-toast";
import {Menu} from "@/types/menu-type";
import Cookies from "js-cookie";
import {isAxiosError} from "axios";
import {compressToBase64} from "lz-string";
import {Permission} from "@/types/permission";
import {useMenuStore, usePermissionsStore} from "@/lib/zustand/store";

const PanelLayout = ({children}: { children: ReactNode }) => {
    const pathName = usePathname();
    const [show, setShow] = useState<boolean>(true);
    const checkingPath = routeWithoutPanel.some((path) => pathName.includes(path));
    const {data: session, status} = useSession();
    const {setPermissions, permissions} = usePermissionsStore();
    const {setMenu, menus} = useMenuStore();

    useEffect(() => {
        const fetchMenus = async () => {
            if (session?.user?.id && session?.accessToken) {

                try {
                    if (menus.length === 0) {
                        const fetchedMenus: Menu[] = await fetcher(`/menu/user`, session.accessToken);
                        setMenu(fetchedMenus)

                        const menuPaths = JSON.stringify(getMenuPath(fetchedMenus))
                        const compressedMenu = compressToBase64(menuPaths)

                        if (menuPaths.length < 4096) {
                            Cookies.set("menu_paths", compressedMenu as string)
                        } else {
                            toast({
                                title: "Terjadi Kesalahan",
                                description: 'Akses menu user terlalu banyak, tidak dapat di kompres',
                            });
                        }

                    }
                } catch (error) {
                    if (isAxiosError(error)) {
                        toast({
                            title: "Terjadi Kesalahan",
                            description: error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga',
                        });
                    }
                }

                if (permissions.length === 0) {
                    const permissions: Permission[] = await fetcher(`/user-access/permission`, session.accessToken);
                    setPermissions(permissions);
                }
            }
        };

        const getMenuPath = (menus: Menu[]) => {
            const paths: string[] = [];
            menus.forEach((menu) => {
                if (menu?.children && menu.is_submenu) {
                    menu?.children.forEach((submenu) => {
                        if (submenu.pathname) paths.push(submenu?.pathname)
                    })
                } else {
                    if (menu?.pathname) paths.push(menu.pathname)
                }
            })
            return paths;
        }
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
                    <Navigation show={show}/>
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