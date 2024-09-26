import {LucideIcon} from "lucide-react";
import {CounterMenu} from "@/enums/Menu";

type Menu = {
    icon : LucideIcon,
    href?: string,
    label: string,
    submenus?: Submenu[],
    tag?: string
}

type Submenu = {
    href: string,
    label: string,
    active?: boolean,
}

export type {Menu, Submenu}