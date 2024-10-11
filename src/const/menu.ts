import {Menu} from "@/types/menu-type";
import {CounterMenu, DemographicMenu, InventoryMenu} from "@/enums/Menu";

const MENU_CACHE_KEY = 'user_menu';
const LAST_FETCH_KEY = 'last_menu_fetch';

const counterMenus: Menu[] = [
    {
        label: "Loket Admisi",
        icon: 'LuClipboardList',
        tag: CounterMenu.ADMISSION
    },
    {
        label: "Loket Farmasi",
        icon: 'LuPill',
        tag: CounterMenu.PHARMACY
    },
];

const inventoryMenus: Menu[] = [
    {
        label: "Input Alat Kesehatan",
        icon: 'Clipboard',
        tag: InventoryMenu.ADDALKES
    },
    {
        label: "Input Data Ruangan",
        icon: 'Bed',
        tag: InventoryMenu.ADDROOM,
    },
    {
        label: "Pemeliharaan",
        icon: 'Wrench',
        tag: InventoryMenu.MAINTENANCE
    }
]

const demographicMenus: Menu[] = [
    {
        label: "Agama",
        icon: 'Moon',
        tag: DemographicMenu.RELIGION
    },
    {
        label: "Tingkat Pendidikan",
        icon: 'GraduationCap',
        tag: DemographicMenu.EDUCATION_LEVEL,
    },
    {
        label: "Status Kawin",
        icon: 'Ribbon',
        tag: DemographicMenu.MARITAL_STATUS
    }
]

export {counterMenus, inventoryMenus, demographicMenus, MENU_CACHE_KEY, LAST_FETCH_KEY};