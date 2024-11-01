import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import CollapseMenu from "@/components/ui/collapse-menu";
import Menu from "@/components/ui/menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Skeleton} from "@/components/ui/skeleton";
import {Menu as MenuType, Submenu} from "@/types/menu-type";
import {TrafficCone} from "lucide-react";
import {useMenuStore} from "@/lib/zustand/store";

interface NavigationProps {
    show: boolean;
}


export const Navigation = ({show}: NavigationProps) => {
    const pathname = usePathname();
    const [openCollapseId, setOpenCollapseId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navBaseClass = 'w-[324px] h-content border-r border-r-gray-200 p-6 transition-all duration-50 bg-white top-[72px]';
    const {menus} = useMenuStore()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    const findPathname = (menus: Submenu[]) => {
        return menus.some(menu => {
            const regex = new RegExp(`^${menu.pathname}($|/)`);
            return regex.test(pathname);
        });
    };

    const handleToggle = (id: string) => {
        setOpenCollapseId(prevId => (prevId === id ? null : id));
    };

    return (
        <nav
            className={show ? `${navBaseClass} fixed md:static z-30 translate-x-0 hidden md:block` : `${navBaseClass} -translate-x-[324px] absolute hidden md:block`}>
            <ScrollArea className="h-[calc(100vh_-_121px)] rounded-md">
                <div className="space-y-2 mr-2.5">
                    {menus.length > 0 ? (
                        menus.map((menu: MenuType, index: number) => (
                            <React.Fragment key={index}>
                                {menu?.is_submenu ? (
                                    <CollapseMenu
                                        id={`${menu.label.replace(' ', '-')}-${index}`}
                                        iconName={menu.icon}
                                        label={menu.label}
                                        submenus={menu.children || []}
                                        active={findPathname(menu.children || [])}
                                        open={openCollapseId === `${menu.label.replace(' ', '-')}-${index}`}
                                        onToggle={handleToggle}
                                    />
                                ) : (
                                    <Menu
                                        href={`${menu.pathname}`}
                                        label={menu.label}
                                        active={(menu.pathname && menu?.pathname !== '/')? pathname.startsWith(menu.pathname) : pathname === '/'}
                                        iconName={menu.icon}
                                    />
                                )}
                            </React.Fragment>
                        ))
                    ) : isLoading ? (
                        Array.from({length: 4}, (_, index) => (
                            <Skeleton className="h-10 w-full rounded-lg" key={index}/>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">
                            <div className="bg-red-600 text-white w-12 h-12 p-2 rounded-full mx-auto mb-2">
                                <TrafficCone className="w-8 h-8 mb-2"/>
                            </div>
                            <span className="text-gray-900">Tidak ada menu yang tersedia</span>
                            <span className="text-sm block mt-1">Silakan hubungi pihak terkait untuk menambahkan akses anda</span>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </nav>
    );
};
