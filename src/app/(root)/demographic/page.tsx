"use client"
import Heading from "@/components/ui/heading";
import {useState} from "react";
import {DemographicMenu} from "@/enums/Menu";
import {demographicMenus} from "@/const/menu";
import Menu from "@/components/ui/menu";
import Religion from "@/app/(root)/demographic/religion";
import EducationLevel from "@/app/(root)/demographic/education-level";
import MaritalStatus from "@/app/(root)/demographic/marital-status";

const Demographic = () => {
    const [demographicMenu, setDemographicMenu] = useState<DemographicMenu>(DemographicMenu.RELIGION);

    const handleDemographicMenu = (menu: string) => {
        switch (menu) {
            case "MARITAL_STATUS":
                setDemographicMenu(DemographicMenu.MARITAL_STATUS)
                break
            case "EDUCATION_LEVEL":
                setDemographicMenu(DemographicMenu.EDUCATION_LEVEL)
                break
            default:
                setDemographicMenu(DemographicMenu.RELIGION)
                break
        }
    }
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Master Data Demografis</Heading>

            <div className="flex flex-col lg:flex-row gap-6">
                <div
                    className="w-full md:w-1/4 sm:min-w-[260px] bg-white h-max border border-graay-200 rounded-lg p-4">
                    <Heading headingLevel="h5" variant="section-title">
                        Submenu
                    </Heading>
                    <div className="ms-2.5 space-y-2">
                        {demographicMenus.map((menu, index) => {
                            return (
                                <Menu
                                    key={index}
                                    icon={menu.icon}
                                    label={menu.label}
                                    asButton={true}
                                    active={menu.tag == demographicMenu}
                                    onClick={() => handleDemographicMenu(menu.tag ?? "RELIGION")}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="w-full">
                    {
                        demographicMenu == DemographicMenu.RELIGION ? (
                            <Religion/>
                        ) : demographicMenu === DemographicMenu.EDUCATION_LEVEL ? (
                            <EducationLevel/>
                        ) : (<MaritalStatus/>)
                    }
                </div>
            </div>
        </>
    )
}

export default Demographic