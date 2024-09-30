import {
    Bed,
    BetweenHorizonalStart,
    Box,
    BriefcaseMedical,
    CircleGauge,
    Clipboard,
    LayoutDashboard,
    UserRoundPen,
    Users,
    Wrench,
} from "lucide-react";
import {Menu} from "@/types/menu-type";
import {CounterMenu, InventoryMenu} from "@/enums/Menu";

const menus: Menu[] = [
    {
        icon: CircleGauge,
        href: "/",
        label: "Dashboard",
    },
    {
        icon: Users,
        label: "Antrean",
        submenus: [
            {label: "Ambil Antrean", href: "/queue/polyclinic", active: true},
            {label: "Loket Antrean", href: "/queue/counter", active: false},
            {label: "Check-In Antrean", href: "#", active: false},
            {label: "Daftar Antrean", href: "/queue/list", active: false},
            {label: "Display Antrean", href: "#", active: false},
        ],
    },
    {
        icon: UserRoundPen,
        href: "/registration",
        label: "Pendaftaran",
    },
    {
        icon: LayoutDashboard,
        href: "/components",
        label: "Components",
    },
    {
        icon: Box,
        label: "Inventory",
        submenus: [
            {label: "Alat Kesehatan", href: "/inventory-alkes", active: false},
            {label: "Barang Habis Pakai", href: "/consumables", active: false},
            {label: "Peralatan Non-Medis", href: "/non-clinical", active: false},
        ],
    },
    {
        icon: BetweenHorizonalStart,
        label: "Collapse Menu",
        submenus: [
            {label: "Submenu 1", href: "/components/test-page", active: false},
            {label: "Submenu 2", href: "#", active: false},
        ],
    },
];

const counterMenus: Menu[] = [
    {
        label: "Loket Admisi",
        icon: Clipboard,
        tag : CounterMenu.ADMISSION
    },
    {
        icon: BriefcaseMedical,
        label: "Loket Farmasi",
        tag : CounterMenu.PHARMACY
    },
];

const inventoryMenus: Menu[] = [
    {
        label: "Input Alat Kesehatan",
        icon: Clipboard,
        tag : InventoryMenu.ADDALKES
    },
    {
        label: "Input Data Ruangan",
        icon : Bed,
        tag : InventoryMenu.ADDROOM,
    },
    {
        label : "Pemeliharaan",
        icon : Wrench,
        tag : InventoryMenu.MAINTENANCE
    }
]
export {menus, counterMenus, inventoryMenus};


