'use client';
import React, {ReactNode, useEffect, useState} from 'react';
import TopBar from '@/components/ui/top-bar';
import {Navigation} from '@/components/ui/navigation';
import Footer from '@/components/ui/footer';
import DynamicBreadcrumb from '@/components/ui/dynamic-breadcrumb';
import {AppProgressBar as ProgressBar} from 'next-nprogress-bar';
import {usePathname, useRouter} from 'next/navigation';
import {routeWithoutPanel} from '@/const/routeWithoutPanel';
import {useSession} from 'next-auth/react';
import useSWR from 'swr';
import {NextAuthSession} from '@/types/session';
import {fetcher} from '@/utils/fetcher';

const PanelLayout = ({children}: { children: ReactNode }) => {
    const pathName = usePathname();
    const router = useRouter();
    const [show, setShow] = useState<boolean>(true);
    const handleShowMenu = () => setShow((prev) => !prev);
    const checkingPath = routeWithoutPanel.some((path) => pathName.includes(path));
    const {data: session, status} = useSession() as { data: NextAuthSession; status: string };
    const {data: menus,} = useSWR(session?.apiToken ? ['/menu', session.apiToken, status] : null, fetcher);

    useEffect(() => {
        if (!checkingPath && status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, checkingPath, router]);

    if (checkingPath) {
        return (
            <>
                <ProgressBar height="5px" color="#F1A7AC" options={{showSpinner: false}} shallowRouting/>
                {children}
            </>
        );
    }


    if (status === 'authenticated') {
        return (
            <>
                <ProgressBar height="5px" color="#F1A7AC" options={{showSpinner: false}} shallowRouting/>
                <div className="w-screen h-dvh overflow-hidden">
                    <TopBar onToggleMenu={handleShowMenu} menus={menus}/>
                    <div className="flex h-content overflow-hidden">
                        <Navigation show={show} menus={menus}/>
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
    }
};

export default PanelLayout;
