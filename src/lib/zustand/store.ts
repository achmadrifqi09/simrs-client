import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {Permission} from "@/types/permission";
import {Menu} from "@/types/menu-type";

interface PermissionsState {
    permissions: Permission[];
    setPermissions: (permissions: Permission[]) => void;
    getPermissions: (path: string) => Permission | undefined;
    clearPermissions: () => void;
}

interface MenusState {
    menus: Menu[];
    setMenu: (menu: Menu[]) => void;
    clearMenu: () => void;
}

export const usePermissionsStore = create<PermissionsState>()(
    persist(
        (set, get) => ({
            permissions: [],
            setPermissions: (permissions: Permission[]) => set({permissions}),
            getPermissions: (path: string): Permission | undefined => {
                const state = get();
                return state.permissions.find(permission => permission.menu.tag === path);
            },
            clearPermissions: () => set({ permissions: [] })
        }),
        {
            name: 'user_permissions',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

export const useMenuStore = create<MenusState>()(
    persist(
        (set) => ({
            menus: [],
            setMenu: (menus: Menu[]) => set({menus}),
            clearMenu: () => set({ menus: [] })
        }),
        {
            name: 'user_menus',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
