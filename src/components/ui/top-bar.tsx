"use client"
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import MobileNavigation from "@/components/ui/mobile-navigation";
import {signOut, useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Skeleton} from "@/components/ui/skeleton";
import {Menu as MenuType} from "@/types/menu-type";
import {LuAlignLeft, LuChevronDown, LuLogOut} from "react-icons/lu";
import {clearClientSideCookies} from "@/utils/cookies-cleaner";
import {useMenuStore, usePermissionsStore} from "@/lib/zustand/store";


type TopBarProps = {
    onToggleMenu: () => void
}

const TopBar = ({onToggleMenu}: TopBarProps) => {
    const {data: session, status} = useSession()
    const router = useRouter()
    const handleToggleMenu = () => {
        onToggleMenu()
    }
    const {clearPermissions} = usePermissionsStore()
    const {clearMenu} = useMenuStore()
    const handleLogout = () => {
        signOut()
            .then(() => {
                router.push('/login')
                clearMenu()
                clearClientSideCookies()
                clearPermissions()
            })
            .catch((error) => {
                toast({
                    title: "Terjadi kesalahan",
                    description: error.message,
                })
            })
    }

    const getAvatarCharacter = (name: string) => {
        return name
            .split(" ")
            .slice(0, 2)
            .map(char => char[0])
            .join('');
    };

    return (
        <div
            className="flex items-center justify-between bg-gradient-to-br from-red-600 to-red-500 sticky top-0 border-b border-b-gray-300">
            <div
                className="flex gap-2 items-center bg-transparent md:w-[324px] h-[72px] md:border-r md:border-r-red-300 md:bg-gradient-to-br md:from-orange-600 to-red-600 pl-4 md:pl-6">
                <Image src="/images/logo-rs-white.png" alt="Logo RSU UMM" width={48} height={48}/>
                <div>
                    <h4 className="font-semibold text-white leading-5 hidden md:block select-none">
                        <span className="font-normal">SIMRS</span>
                        {" "}Universitas<br/>Muhammadiyah Malang</h4>
                </div>
            </div>
            <div className="flex items-center justify-end md:justify-between flex-1 px-4 md:px-6">
                {
                    status === 'loading' ? (
                        <Skeleton className="w-8 h-8 bg-red-500 hidden md:block"/>
                    ) : (
                        <Button onClick={handleToggleMenu} variant="ghost" size="icon"
                                className="text-white hover:bg-red-500 hover:text-white hidden md:flex">
                            <LuAlignLeft className="w-6 h-6"/>
                        </Button>
                    )
                }

                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="active:border-none active:ring-0 focus:border-none focus:ring-0 focus:outline-0">
                            <div className="flex gap-2 items-center text-white">
                                {
                                    status === 'loading' ? (
                                        <>
                                            <Skeleton className="w-9 h-9 rounded-full bg-red-400"/>
                                            <Skeleton className="w-24 h-4 rounded-full bg-red-400"/>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="h-9 w-9 aspect-square bg-red-600 rounded-full font-medium flex select-none items-center justify-center uppercase">
                                                {session?.user?.name ? (getAvatarCharacter(session?.user?.name)) : 'U'}
                                            </div>
                                            <span
                                                className="text-base select-none">{session?.user?.name || "user"}</span>
                                            <LuChevronDown className="w-4 h-4"/>
                                        </>
                                    )
                                }
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mr-3.5 mt-4">
                            <DropdownMenuItem onClick={handleLogout}>
                                <LuLogOut className="mr-2 h-4 w-4"/>
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <MobileNavigation/>
            </div>
        </div>
    )
}

export default TopBar