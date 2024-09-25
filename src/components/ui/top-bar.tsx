"use client"
import {AlignLeft, ChevronDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import MobileNavigation from "@/components/ui/mobile-navigation";

type TopBarProps = {
    onToggleMenu: () => void
}

const TopBar = ({onToggleMenu}: TopBarProps) => {

    const handleToggleMenu = () => {
        onToggleMenu()
    }

    return (
        <div
            className="flex items-center justify-between bg-gradient-to-br from-red-600 to-orange-600 sticky top-0">
            <div
                className="flex gap-2 items-center bg-transparent md:w-[324px] h-[72px] md:border-r md:border-r-red-300 md:bg-gradient-to-br md:from-orange-600 to-red-600 pl-4 md:pl-6">
                <Image src="/images/logo-rs-white.png" alt="Logo RSU UMM" width={48} height={48}/>
                <div>
                    <h4 className="font-semibold text-white leading-5 hidden md:block">
                        <span className="font-normal">SIMRS</span>
                        {" "}Universitas<br/>Muhammadiyah Malang</h4>
                </div>
            </div>
            <div className="flex items-center justify-end md:justify-between flex-1 px-4 md:px-6">

                <Button onClick={handleToggleMenu} variant="ghost" size="icon"
                        className="text-white hover:bg-red-500 hover:text-white hidden md:flex">
                    <AlignLeft/>
                </Button>

                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex gap-2 items-center text-white">
                                <div
                                    className="h-9 w-9 aspect-square bg-red-600 rounded-full font-medium flex items-center justify-center">
                                    UN
                                </div>
                                <span className="text-base">Username</span>
                                <ChevronDown className="w-4 h-4"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <MobileNavigation/>
            </div>

        </div>
    )
}

export default TopBar