"use client"
import React from "react"
import {useNavigation} from "@/lib/zustand/store";
import CollapseMenu from "@/components/ui/collapse-menu";
import Menu from "@/components/ui/menu";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {useWindowResizeHandler, useWindowSize} from "@/hooks/use-window-size";
import {menus} from "@/const/menu";

type Submenu = {
    href: string,
    label: string,
    active?: boolean,
}

export const Navigation = () => {
    const {show, toggle} = useNavigation()
    const size = useWindowSize()
    useWindowResizeHandler()
    const pathname = usePathname()
    const [openCollapseId, setOpenCollapseId] = useState<string | null>(null)
    const navBaseClass: string = 'w-[324px] h-content border-r border-r-gray-200 p-6 transition-all duration-50 bg-white top-[72px]';

    const findPathname = (menus: Submenu[]) => {
        return menus.some(menu => menu.href === pathname);
    };

    const handleToggle = (id: string) => {
        setOpenCollapseId(prevId => (prevId === id ? null : id));
    };

    const handleMenuClick = () => {
        if(window){
            if (size?.width && size?.width < 1024) toggle()
        }
        setOpenCollapseId(null)
    };

    return (
        <nav
            className={show ? `${navBaseClass} fixed md:static z-30 translate-x-0` : `${navBaseClass} -translate-x-[324px] absolute`}>
            <div className="space-y-2">
                {
                    menus.map((menu, index: number) => {
                        return (
                           <React.Fragment key={index}>
                               {menu?.submenus ? (
                                   <CollapseMenu
                                       id={`${menu.label.replace(' ', '-')}-${index}`}
                                       icon={menu.icon}
                                       label={menu.label}
                                       submenus={menu.submenus}
                                       active={findPathname(menu.submenus)}
                                       open={openCollapseId === `${menu.label.replace(' ', '-')}-${index}`}
                                       onToggle={handleToggle}/>
                               ) : (
                                   <Menu icon={menu.icon} href={`${menu.href}`} label={menu.label} active={pathname === menu.href}
                                         onClick={handleMenuClick}/>
                               )}
                           </React.Fragment>
                        )
                    })
                }
            </div>
        </nav>
    );
};