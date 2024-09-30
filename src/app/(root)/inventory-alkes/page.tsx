"use client";
import Heading from "@/components/ui/heading";
import Menu from "@/components/ui/menu";
import { useState } from "react";
import { InventoryMenu } from "@/enums/Menu";
import { inventoryMenus } from "@/const/menu";
import AddAlkes from "@/app/(root)/inventory-alkes/addAlkes";
import AddRoom from "@/app/(root)/inventory-alkes/addRoom";
import Maintenancen from "@/app/(root)/inventory-alkes/maintenance";


const InventoryAlkes = () => {
    const [inventory, setInventory] = useState<InventoryMenu>(InventoryMenu.ADDALKES)
    const handleMenuInventory = (menu: string) => {
        if (menu === "ADDALKES") {
            setInventory(InventoryMenu.ADDALKES)
        } else if (menu === "ADDROOM") {
            setInventory(InventoryMenu.ADDROOM)
        } else {
            setInventory(InventoryMenu.MAINTENANCE)
        }
    }
    return (<>

        <div>
            <div className="flex justify-between items-center ">
                <Heading headingLevel="h3" variant="page-title">
                    Inventory Alat Kesehatan
                </Heading>
            </div>

            <div>
                <div className="flex flex-col xl:flex-row gap-6 mb-8">
                    <div className="w-full border border-graay-200 rounded-lg p-4">
                        <p className="font-bold mb-2">Menu</p>
                        <div className="grid grid-cols-3">
                            {inventoryMenus.map((menu, index) => {
                                return (
                                    <Menu
                                        key={index}
                                        icon={menu.icon}
                                        label={menu.label}
                                        asButton={true}
                                        active={menu.tag == inventory}
                                        onClick={() => handleMenuInventory(menu.tag ?? "ADDALKES")}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                {
                    inventory === InventoryMenu.ADDALKES ? (
                        <AddAlkes />
                    ) : inventory === InventoryMenu.ADDROOM ? (
                        <AddRoom />
                    ) : (
                        <Maintenancen />
                    )

                }
            </div>
        </div>
    </>
    );
};

export default InventoryAlkes;
