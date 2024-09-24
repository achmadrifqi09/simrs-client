"use client"
import { Button } from "@/components/ui/button";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import Menu from "@/components/ui/menu";
import { LucideIcon, Pill, Clipboard } from "lucide-react";

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

const TestPage = () => {

    const handleMenuClick = () => { }
    return (
        <div>
            <div className="flex justify-between items-center ">
                <Heading headingLevel="h3" variant="page-title">Loket Antrean</Heading>
                <Button variant="outline">Kelola Loket</Button>
            </div>

            <div>
                <strong>Menu</strong>

                <div className="flex">
                    <div className="w-1/4 min-w-[180px]">
                        {
                            menus.map((menu, index) => {
                                return (
                                    <Menu key={index} icon={menu.icon} href={`${menu.href}`} label={menu.label} active={false}
                                        onClick={handleMenuClick} />
                                )
                            })
                        }
                    </div>

                    <div>
                        <Section>
                            <Heading headingLevel="h5">Daftar Loket Admisi</Heading>
                            <div className="flex gap-4 flex-wrap">
                                <div>
                                    <a href="/queue/locket">
                                        Loket 1
                                    </a>
                                </div>
                                <div>
                                    <a href="/queue/lockets">
                                        Loket 2
                                    </a>
                                </div>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                                <Button>Kelola Loket</Button>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestPage;
