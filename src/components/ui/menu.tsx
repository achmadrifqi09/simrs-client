import {LucideIcon} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface MenuProps {
    icon: LucideIcon,
    href: string,
    label: string,
    active: boolean,
    closeMenu?: () => void
}

const Menu = ({icon: Icon, href, label, active, closeMenu}: MenuProps) => {
    const baseClass = "mx-[-0.65rem] w-full hover:bg-gray-50 flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"

    return (
        <Link
            href={href}
            onClick={closeMenu}
            className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-600 hover:text-white')}
        >
            <Icon className="h-5 w-5"/>
            {label}
        </Link>
    )
}

export default Menu;