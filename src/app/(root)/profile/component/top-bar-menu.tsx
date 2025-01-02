import * as React from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Logs } from 'lucide-react';
import { userMenus } from '@/const/user-menu-data';
import { UserMenu } from '@/types/user-menu';
import { UserMenuEnum } from '@/enums/user-menu';

interface UserTopbarMenuProps {
    activeUserMenu: UserMenuEnum;
    setActiveUserMenu: React.Dispatch<React.SetStateAction<UserMenuEnum>>;
}

const UserTopbarMenu = ({ activeUserMenu, setActiveUserMenu }: UserTopbarMenuProps) => {
    return (
        <Menubar className="block lg:hidden w-max mb-4">
            <MenubarMenu>
                <MenubarTrigger>
                    <Logs className="w-5 h-5 text-gray-600 mr-2" />
                    <span>Menu Pengguna</span>
                </MenubarTrigger>
                <MenubarContent align="start">
                    {userMenus.map((menu: UserMenu, i: number) => {
                        return (
                            <MenubarItem
                                key={i}
                                className={
                                    activeUserMenu === menu.value
                                        ? 'gap-2 my-2 text-red-600'
                                        : 'gap-2 my-2 text-gray-500'
                                }
                                onClick={() => setActiveUserMenu(menu.value)}
                            >
                                <menu.icon className="w-5 h-5" />
                                {menu.label}
                            </MenubarItem>
                        );
                    })}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default UserTopbarMenu;
