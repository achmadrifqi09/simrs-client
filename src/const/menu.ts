import {
    Bed,
    BetweenHorizonalStart,
    Box,
    BriefcaseMedical,
    CircleGauge,
    Clipboard,
    Database, GraduationCap,
    LayoutDashboard, Moon, Ribbon,
    UserRoundPen,
    Users,
    Wrench,
} from "lucide-react";
import {Menu} from "@/types/menu-type";
import {CounterMenu, DemographicMenu, InventoryMenu} from "@/enums/Menu";

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
        icon: Database,
        label: "Data Master",
        submenus: [
            {label: "Demografis", href: "/demographic", active: true},
            {label: "Geografis", href: "/demographic", active: true},
            {label: "Karyawan", href: "/queue/polyclinic", active: true},
            {label: "Penunjang", href: "/queue/polyclinic", active: true},
        ]
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
            {label: "Barang Habis Pakai", href: "/Consumables", active: false},
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
        tag: CounterMenu.ADMISSION
    },
    {
        icon: BriefcaseMedical,
        label: "Loket Farmasi",
        tag: CounterMenu.PHARMACY
    },
];

const inventoryMenus: Menu[] = [
    {
        label: "Input Alat Kesehatan",
        icon: Clipboard,
        tag: InventoryMenu.ADDALKES
    },
    {
        label: "Input Data Ruangan",
        icon: Bed,
        tag: InventoryMenu.ADDROOM,
    },
    {
        label: "Pemeliharaan",
        icon: Wrench,
        tag: InventoryMenu.MAINTENANCE
    }
]

const demographicMenus: Menu[] = [
    {
        label: "Agama",
        icon: Moon,
        tag: DemographicMenu.RELIGION
    },
    {
        label: "Tingkat Pendidikan",
        icon: GraduationCap,
        tag: DemographicMenu.EDUCATION_LEVEL,
    },
    {
        label: "Status Kawin",
        icon: Ribbon,
        tag: DemographicMenu.MARITAL_STATUS
    }
]
export {menus, counterMenus, inventoryMenus, demographicMenus};


