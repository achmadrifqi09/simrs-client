import {
  BetweenHorizonalStart,
  CircleGauge,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { Menu } from "@/types/menu-type";

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
      { label: "Ambil Antrean", href: "/queue/polyclinic", active: true },
      { label: "Loket Antrean", href: "/queue/counter", active: false },
      { label: "Check-In Antrean", href: "#", active: false },
      { label: "Daftar Antrean", href: "/queue/list", active: false },
      { label: "Display Antrean", href: "#", active: false },
    ],
  },
  {
    icon: LayoutDashboard,
    href: "/components",
    label: "Components",
  },
  {
    icon: BetweenHorizonalStart,
    label: "Collapse Menu",
    submenus: [
      { label: "Submenu 1", href: "/components/test-page", active: false },
      { label: "Submenu 2", href: "#", active: false },
    ],
  },
];

export { menus };
