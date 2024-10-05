"use client"
import React from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Submenu} from '@/types/menu-type'
import Icon from "@/components/ui/icon";
import {usePathname} from "next/navigation";
import {  LuChevronDown} from "react-icons/lu";

interface CollapseMenuButtonProps {
    iconName: string,
    label: string,
    submenus: Submenu[] | [],
    active: boolean,
    onToggle: (id: string) => void,
    id: string,
    open: boolean,
    closeMenu?: () => void
}

const CollapseMenu = ({iconName, label, submenus, active, onToggle, id, open, closeMenu}: CollapseMenuButtonProps) => {
    const pathname = usePathname()
    const baseClass = "w-full hover:bg-gray-50 flex justify-between items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary";
    const baseClassSubmenu = "mx-[-0.65rem] w-full hover:bg-gray-50 flex justify-between items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary";
    const findPathname = (menuPath: string) => {
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedMenuPath = escapeRegExp(menuPath);
        const regex = new RegExp(`^${escapedMenuPath}(/.*)?$`);
        return regex.test(pathname);
    };

    return (
        <>
            <Collapsible open={open} onOpenChange={() => onToggle(id)} className="w-full select-none">
                <CollapsibleTrigger className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1" asChild>
                    <button
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-500 hover:text-white')}
                    >
                        <div className="flex gap-4 items-center">
                            <Icon nameIcon={iconName} />
                            {label}
                        </div>
                        {open ? (
                            <LuChevronDown className="w-5 h-5"/>
                        ) : (
                            <LuChevronDown className="w-5 h-5"/>
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="ms-10 border-l border-l-gray-300 mt-1 space-y-1.5 ps-4 relative">
                        {submenus.map((submenu: Submenu, index: number) => (
                            <Link
                                className={`${baseClassSubmenu} ${findPathname(submenu.pathname) && (
                                    cn('bg-gray-50 before:slide-down before:content-[""] before:w-1 before:h-8 before:absolute before:bg-red-600 before:-left-[1px] before:rounded text-red-600')
                                )}`}
                                href={submenu.pathname}
                                onClick={closeMenu}
                                key={index}
                            >
                                {submenu.label}
                            </Link>
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
};


export default CollapseMenu