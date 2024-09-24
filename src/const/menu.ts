import { UserIcon} from "lucide-react";
import {BetweenHorizonalStart, CircleGauge, LayoutDashboard} from "lucide-react";
import Menu from "@/types/menu-type";

const menus : Menu[] = [
    {
        icon: CircleGauge,
        href: '/',
        label: 'Dashboard',
    },
    {
        icon: LayoutDashboard,
        href: '/components',
        label: 'Components',
    },
    {
        icon: BetweenHorizonalStart,
        label: 'Collapse Menu',
        submenus: [
            {label: "Submenu 1", href: '/components/test-page', active: false},
            {label: "Submenu 2", href: '#', active: false},
        ]
    },
    {
        icon: UserIcon,
        label: 'Testing Menu',
        submenus: [
            {label: "Submenu 2.1", href: '#', active: false},
            {label: "Submenu 2.2", href: '#', active: false},
        ]
    },
]

export {menus}