"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Menu from "@/components/ui/menu";
import {counterMenus} from "@/const/menu";
import {CounterMenu} from "@/enums/Menu";
import Admission from "@/app/(root)/queue/(user)/counter/admission";
import Pharmacy from "@/app/(root)/queue/(user)/counter/pharmacy";

const Counter = () => {
    const [counter, setCounter] = useState<CounterMenu>(CounterMenu.ADMISSION);

    const handleMenuCounter = (menu: string) => {
        if (menu === "ADMISSION") {
            setCounter(CounterMenu.ADMISSION)
        } else {
            setCounter(CounterMenu.PHARMACY)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Heading headingLevel="h3" variant="page-title">
                    Loket Antrean
                </Heading>
                <Button variant="outline">Kelola Loket</Button>
            </div>

            <div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div
                        className="w-full md:w-1/4 sm:min-w-[220px] bg-white h-max border border-graay-200 rounded-lg p-4">
                        <Heading headingLevel="h5" variant="section-title">
                            Menu
                        </Heading>
                        <div className="ms-2.5 space-y-2">
                            {counterMenus.map((menu, index) => {
                                return (
                                    <Menu
                                        key={index}
                                        icon={menu.icon}
                                        label={menu.label}
                                        asButton={true}
                                        active={menu.tag == counter}
                                        onClick={() => handleMenuCounter(menu.tag ?? "ADMISSION")}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full">
                        {
                            counter == CounterMenu.ADMISSION ? (
                                <Admission/>
                            ) : (<Pharmacy/>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Counter;
