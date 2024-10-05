type Submenu = {
    label: string;
    pathname: string;
    id_menu: number;
}

type Menu = {
    id?: number;
    label: string;
    order?: number;
    icon: string;
    pathname?: string | null;
    is_submenu?: boolean;
    submenu?: Submenu[] | [];
    tag?: string,
}

type PermissionSubMenu = {
    id_submenu: number;
    is_view: boolean;
    is_create: boolean;
    is_update: boolean;
    is_delete: boolean;
};

type PermissionMenu = {
    nama: string;
    id_menu: number;
    is_view: boolean;
    is_create: boolean;
    is_update: boolean;
    is_delete: boolean;
    submenu: PermissionSubMenu[];
};

type PermissionData = {
    izin_menu: PermissionMenu;
};


export type {Menu, Submenu, PermissionMenu, PermissionSubMenu, PermissionData}