"use client"
import { Button } from "@/components/ui/button";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import Menu from "@/components/ui/menu";
import { LucideIcon, Pill, Clipboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import SolidCard from "@/components/ui/solid-card";

type Menu = {
    icon: LucideIcon,
    href?: string,
    label: string,
}

const menus: Menu[] = [
    {
        icon: Clipboard,
        href: '/',
        label: 'Loket Admisi',
    },
    {
        icon: Pill,
        href: '/',
        label: 'Loket Farmasi',
    },
]

const Locket = () => {

    const handleMenuClick = () => { }
    return (
        <div>
            <div className="flex justify-between items-center ">
                <Heading headingLevel="h3" variant="page-title">Loket Antrean</Heading>
                <Button variant="outline">Kelola Loket</Button>
            </div>

            <div>
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="w-1/4 min-w-[180px] border border-graay-200 rounded-lg p-4">
                        <p className="font-bold mb-2">Menu</p>
                        {
                            menus.map((menu, index) => {
                                return (
                                    <Menu key={index} icon={menu.icon} href={`${menu.href}`} label={menu.label} active={false}
                                        onClick={handleMenuClick} />
                                )
                            })
                        }
                    </div>

                    <div className="w-full">
                        <Section>
                            <Heading headingLevel="h5">Daftar Loket Admisi</Heading>
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                                <SolidCard href="/queue/locket/1">
                                    <p>Loket 1</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/2">
                                    <p>Loket 2</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/3">
                                    <p>Loket 3</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/4">
                                    <p>Loket 4</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/5">
                                    <p>Loket 5</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/6">
                                    <p>Loket 6</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/7">
                                    <p>Loket 7</p>
                                </SolidCard>
                                <SolidCard href="/queue/locket/8">
                                    <p>Loket 8</p>
                                </SolidCard>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Locket;
