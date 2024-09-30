"use client"
import Heading from "@/components/ui/heading";
import {useState} from "react";
import InventoryTable from "@/app/(root)/consumables/consumablesTable";

const consumables = () => {
    const [items, setItems] = useState([
        {name: "Sarung Tangan Medis", brand: "MedCare", quantity: 150, description: "Stok mencukupi"},
        {name: "Masker Bedah", brand: "SafeMask", quantity: 50, description: "Stok di bawah minimum"},
        {name: "Jarum Suntik", brand: "NeedlePro", quantity: 20, description: "Stok di bawah minimum"},
        {name: "Infus Set", brand: "InfuMed", quantity: 200, description: "Stok mencukupi"},
    ]);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">
                Barang Habis Pakai
            </Heading>
            <InventoryTable items={items}/>
        </>
    );
}
export default consumables