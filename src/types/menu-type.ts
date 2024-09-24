import {LucideIcon} from "lucide-react";

type Menu = {
    icon : LucideIcon,
    href?: string,
    label: string,
    submenus?: Submenu[]
}

type Submenu = {
    href: string,
    label: string,
    active?: boolean,
}

export type {Menu, Submenu}