import Link from "next/link";
import {cn} from "@/lib/utils";
import Icon from "@/components/ui/icon";
import React from "react";

interface MenuProps {
    iconName: string,
    href?: string,
    label: string,
    active?: boolean,
    onClick?: () => void,
    asButton?: boolean
}

const Menu = ({iconName, href, label, active, onClick, asButton = false}: MenuProps) => {
    const baseClass = "select-none w-full hover:bg-gray-50 flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"

    return (
        <>
            {
                asButton ? (
                    <button
                        onClick={onClick}
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-red-500 whitespace-nowrap text-white hover:from-red-500 hover:to-red-500 hover:text-white')}
                    >
                        <Icon nameIcon={iconName} />
                        {label}
                    </button>
                ) : (
                    <Link
                        href={href || "#"}
                        onClick={onClick}
                        className={cn(baseClass, active && 'bg-gradient-to-br from-red-600 to-red-500 whitespace-nowrap text-white hover:from-red-500 hover:to-red-500 hover:text-white')}
                    >
                        <Icon nameIcon={iconName} />
                        {label}
                    </Link>
                )
            }

        </>
    )
}

export default Menu;