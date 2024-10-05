import {create} from "zustand";
import {Menu} from "@/types/menu-type";

interface MenuStore {
    menus: Menu[];
    setMenus: (menus: Menu[]) => void;
}

const useMenuStore = create<MenuStore>(set => ({
    menus: [],
    setMenus: (menus) => set({ menus }),
}));

export {useMenuStore}