"use client"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import CollapseMenu from "@/components/ui/collapse-menu";
import Menu from "@/components/ui/menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {AlignRight, TrafficCone} from "lucide-react";
import {usePathname} from "next/navigation";
import {Menu as MenuType, Submenu} from "@/types/menu-type";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useWindowSize} from "@/hooks/use-window-size";
import {Skeleton} from "@/components/ui/skeleton";
import {useMenuStore} from "@/lib/zustand/store";



const MobileNavigation = () => {
    const pathname = usePathname()
    const isMobile = useWindowSize()
    const [isOpen, setOpen] = React.useState(false);
    const [openCollapseId, setOpenCollapseId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const {menus} = useMenuStore()

    const findPathname = (menus: Submenu[]) => {
        return menus.some(menu => {
            const regex = new RegExp(`^${menu.pathname}($|/)`);
            return regex.test(pathname);
        });
    };

    const handleToggleCollapse = (id: string) => {
        setOpenCollapseId(prevId => (prevId === id ? null : id));
    };

    useEffect(() => {
        if (!isMobile) setOpen(false);

        if (menus) {
            setLoading(false);
        }
    }, [isMobile, menus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className="md:hidden">
                    {
                        loading ? (
                            <Skeleton className="w-8 h-8 bg-red-400 ml-2"/>
                        ) : (
                            <Button variant="ghost" size="icon"
                                    className="text-white hover:bg-red-500 hover:text-white">
                                <AlignRight/>
                            </Button>
                        )
                    }
                </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[324px] px-3 h-full flex flex-col" side="left">
                <SheetHeader>
                    <SheetTitle className="text-left absolute top-2.5 ms-1">
                        <div className="flex gap-2">
                            <Image src="/images/logo-rs.png" alt="Logo RSU UMM" className="aspect-square" width={48}
                                   height={48}/>
                            <div>
                                <p className="text-base text-[#054571]">
                                    <span className="text-primary">SIMRS</span> Universitas<br/>
                                    Muhammadiyah Malang
                                </p>
                            </div>
                        </div>
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <ScrollArea className="[&>div>div[style]]:!block md:hidden mt-8">
                    <div className="ps-3.5 space-y-2 mr-2.5">
                        {
                            menus.length > 0 ? (
                                menus?.map((menu: MenuType, index: number) => {
                                    return (
                                        <SheetClose asChild key={index}>
                                            <React.Fragment>
                                                {menu.is_submenu ? (
                                                    <CollapseMenu
                                                        key={index}
                                                        id={`${menu.label.replace(' ', '-')}-${index}`}
                                                        iconName={menu.icon}
                                                        label={menu.label}
                                                        submenus={menu.children || []}
                                                        active={findPathname(menu.children || [])}
                                                        open={openCollapseId === `${menu.label.replace(' ', '-')}-${index}`}
                                                        onToggle={handleToggleCollapse}
                                                        closeMenu={() => setOpen(!open)}/>
                                                ) : (

                                                    <Menu iconName={menu.icon} href={`${menu.pathname}`}
                                                          label={menu.label}
                                                          active={pathname === menu.pathname}
                                                          onClick={() => setOpen(!open)}></Menu>
                                                )}
                                            </React.Fragment>
                                        </SheetClose>
                                    )
                                })
                            ) : loading ? (
                                Array.from({length: 4}, (_, index) => (
                                    <Skeleton className="h-10 w-full rounded-lg" key={index}/>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 mt-4">
                                    <div className="bg-red-600 text-white w-12 h-12 p-2 rounded-full mx-auto mb-2">
                                        <TrafficCone className="w-8 h-8 mb-2"/>
                                    </div>
                                    <span className="text-gray-900">Tidak ada menu yang tersedia</span>
                                    <span className="text-sm block mt-1">Silakan hubungi pihak terkait untuk menambahkan akses anda</span>
                                </div>
                            )
                        }

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavigation