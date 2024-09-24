import {LucideIcon, Users} from "lucide-react";
import {BetweenHorizonalStart, CircleGauge, LayoutDashboard} from "lucide-react";

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

const menus : Menu[] = [
    {
        icon: CircleGauge,
        href: '/',
        label: 'Dashboard',
    },
    {
        icon: Users,
        label: 'Antrean',
        submenus: [
            {label: "Ambil Antrean", href: '/components/test', active: true},
            {label: "Loket Antrean", href: '/queue/locket', active: false},
            {label: "Check-In Antrean", href: '#', active: false},
            {label: "Daftar Antrean", href: '#', active: false},
            {label: "Display Antrean", href: '#', active: false},
        ]
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
]

export {menus}