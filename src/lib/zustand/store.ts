import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Permission} from "@/types/permission";
import {Menu} from "@/types/menu-type";
import {decryptData, encryptData} from "@/lib/crypto-js/cipher";

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
            clearPermissions: () => set({permissions: []})
        }),
        {
            name: 'user_permissions',
            storage: createJSONStorage(() => ({
                getItem: (name: string): string | null => {
                    const value = sessionStorage.getItem(name);
                    if (!value) return null;
                    return decryptData(value);
                },
                setItem: (name: string, value: any): void => {
                    const encryptedValue = encryptData(value);
                    if (encryptedValue) {
                        sessionStorage.setItem(name, encryptedValue);
                    }
                },
                removeItem: (name: string): void => {
                    sessionStorage.removeItem(name);
                },
            })),
        },
    ),
);

export const useMenuStore = create<MenusState>()(
    persist(
        (set) => ({
            menus: [],
            setMenu: (menus: Menu[]) => set({menus}),
            clearMenu: () => set({menus: []})
        }),
        {
            name: 'user_menus',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
