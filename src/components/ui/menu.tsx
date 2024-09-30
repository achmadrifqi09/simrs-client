import {LucideIcon} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";

interface MenuProps {
    icon: LucideIcon,
    href?: string,
    label: string,
    active?: boolean,
    onClick?: () => void,
    asButton?: boolean
}

const Menu = ({icon: Icon, href, label, active, onClick, asButton = false}: MenuProps) => {
    const baseClass = "mx-[-0.65rem] select-none w-full hover:bg-gray-50 flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"

    return (
        <>
            {
                asButton ? (
                    <button
                        onClick={onClick}
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-orange-600 whitespace-nowrap text-white hover:from-red-500 hover:to-orange-600 hover:text-white')}
                    >
                        <Icon className="h-5 w-5"/>
                        {label}
                    </button>
                ) : (
                    <Link
                        href={href || "#"}
                        onClick={onClick}
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-orange-600 whitespace-nowrap text-white hover:from-red-500 hover:to-orange-600 hover:text-white')}
                    >
                        <Icon className="h-5 w-5"/>
                        {label}
                    </Link>
                )
            }

        </>
    )
}

export default Menu;