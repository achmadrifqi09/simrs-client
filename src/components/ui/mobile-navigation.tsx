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
import {AlignRight} from "lucide-react";
import {usePathname} from "next/navigation";
import {menus} from "@/const/menu";
import {Submenu} from "@/types/menu-type";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useWindowSize} from "@/hooks/use-window-size";

const MobileNavigation = () => {
    const pathname = usePathname()
    const isMobile = useWindowSize()
    const [isOpen, setOpen] = React.useState(false);
    const [openCollapseId, setOpenCollapseId] = useState<string | null>(null)

    const findPathname = (menus: Submenu[]) => {
        return menus.some(menu => menu.href === pathname);
    };

    const handleToggleCollapse = (id: string) => {
        setOpenCollapseId(prevId => (prevId === id ? null : id));
    };

    useEffect(() => {
        if(!isMobile) setOpen(false);
    }, [isMobile]);


    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon"
                        className="text-white hover:bg-red-500 hover:text-white md:hidden">
                    <AlignRight/>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[324px] px-3 h-full flex flex-col" side="left">
                <SheetHeader>
                    <SheetTitle className="text-left absolute top-2.5 ms-1">
                        <div className="flex gap-2">
                            <Image src="/images/logo-rs.png" alt="Logo RSU UMM" className="aspect-square" width={48} height={48}/>
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
                    <div className="ps-3.5 space-y-2">
                        {
                            menus.map((menu, index: number) => {
                                return (
                                    <SheetClose asChild key={index}>
                                        <React.Fragment>
                                            {menu?.submenus ? (
                                                <CollapseMenu
                                                    key={index}
                                                    id={`${menu.label.replace(' ', '-')}-${index}`}
                                                    icon={menu.icon}
                                                    label={menu.label}
                                                    submenus={menu.submenus}
                                                    active={findPathname(menu.submenus)}
                                                    open={openCollapseId === `${menu.label.replace(' ', '-')}-${index}`}
                                                    onToggle={handleToggleCollapse}
                                                    closeMenu={() => setOpen(!open)}/>
                                            ) : (

                                                <Menu icon={menu.icon} href={`${menu.href}`} label={menu.label}
                                                      active={pathname === menu.href}
                                                      closeMenu={() => setOpen(!open)}></Menu>
                                            )}
                                        </React.Fragment>
                                    </SheetClose>
                                )
                            })
                        }
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavigation