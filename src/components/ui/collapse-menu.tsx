"use client"
import {ChevronDown, ChevronRight, LucideIcon} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {cn} from "@/lib/utils";
import Link from "next/link";

type Submenu = {
    href: string,
    label: string,
    active?: boolean,
}

interface CollapseMenuButtonProps {
    icon: LucideIcon,
    label: string,
    submenus: Submenu[],
    active: boolean,
    onToggle: (id: string) => void,
    id: string,
    open: boolean,
    closeMenu?: () => void
}

const CollapseMenu = ({icon: Icon, label, submenus, active, onToggle, id, open, closeMenu}: CollapseMenuButtonProps) => {
    const baseClass = "mx-[-0.65rem] w-full hover:bg-gray-50 flex justify-between items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary";

    return (
        <>
            <Collapsible open={open} onOpenChange={() => onToggle(id)} className="w-full">
                <CollapsibleTrigger className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1" asChild>
                    <button
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-600 hover:text-white')}
                    >
                        <div className="flex gap-4 items-center">
                            <Icon className="w-5 h-5"/>
                            {label}
                        </div>
                        {open ? (
                            <ChevronDown className="w-5 h-5"/>
                        ) : (
                            <ChevronRight className="w-5 h-5"/>
                        )}
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="ms-10 border-l border-l-gray-300 ps-4">
                        {submenus.map((submenu: Submenu, index: number) => (
                            <Link
                                className="mx-[-0.65rem] w-full hover:bg-gray-50 flex justify-between items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                                href={submenu.href}
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