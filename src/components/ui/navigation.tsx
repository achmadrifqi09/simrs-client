"use client"
import React, {useEffect, useState} from "react"
import CollapseMenu from "@/components/ui/collapse-menu";
import Menu from "@/components/ui/menu";
import {usePathname} from "next/navigation";
import {Menu as MenuType, Submenu} from "@/types/menu-type";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Skeleton} from "@/components/ui/skeleton";

type NavigationProps = {
    show: boolean
    menus: MenuType[]
}

export const Navigation = ({show, menus}: NavigationProps) => {
    const pathname = usePathname();
    const [openCollapseId, setOpenCollapseId] = useState<string | null>(null);
    const navBaseClass: string = 'w-[324px] h-content border-r border-r-gray-200 p-6 transition-all duration-50 bg-white top-[72px]';
    const [loading, setLoading] = useState<boolean>(true);

    const findPathname = (menus: Submenu[]) => {
        return menus.some(menu => {
            const regex = new RegExp(`^${menu.pathname}($|/)`);
            return regex.test(pathname);
        });
    };

    const handleToggle = (id: string) => {
        setOpenCollapseId(prevId => (prevId === id ? null : id));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (menus) {
            setLoading(false);
        }
    }, [menus]);

    return (
        <nav
            className={show ? `${navBaseClass} fixed md:static z-30 translate-x-0 hidden md:block` : `${navBaseClass} -translate-x-[324px] absolute hidden md:block`}>
            <ScrollArea className="h-[calc(100vh_-_121px)] rounded-md">
                <div className="space-y-2 mr-2.5">
                    {
                        menus?.map((menu: MenuType, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    {menu?.is_submenu ? (
                                        <CollapseMenu
                                            id={`${menu.label.replace(' ', '-')}-${index}`}
                                            iconName={menu.icon}
                                            label={menu.label}
                                            submenus={menu.submenu || []}
                                            active={findPathname(menu.submenu || [])}
                                            open={openCollapseId === `${menu.label.replace(' ', '-')}-${index}`}
                                            onToggle={handleToggle}/>
                                    ) : (
                                        <Menu href={`${menu.pathname}`} label={menu.label}
                                              active={pathname === menu.pathname} iconName={menu.icon}/>
                                    )}
                                </React.Fragment>
                            )
                        })
                    }
                    {loading && (
                        Array.from({length: 4}, (_, index) => (
                            <Skeleton className="h-10 w-full rounded-lg" key={index}/>
                        ))
                    )}
                </div>
            </ScrollArea>
        </nav>
    );
};