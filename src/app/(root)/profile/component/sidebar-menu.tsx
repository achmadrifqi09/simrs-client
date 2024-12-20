import { Button } from '@/components/ui/button';
import Section from '@/components/ui/section';
import { Separator } from '@/components/ui/separator';
import { UserMenuEnum } from '@/enums/user-menu';
import { UserMenu } from '@/types/user-menu';
import { LogOut } from 'lucide-react';
import { SetStateAction } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMenuStore, usePermissionsStore } from '@/lib/zustand/store';
import { clearClientSideCookies } from '@/utils/cookies-cleaner';
import { toast } from '@/hooks/use-toast';
import { userMenus } from '@/const/user-menu-data';

interface UserSidebarProps {
    activeUserMenu: UserMenuEnum;
    setActiveUserMenu: React.Dispatch<SetStateAction<UserMenuEnum>>;
}

const UserSidebarMenu = ({ activeUserMenu, setActiveUserMenu }: UserSidebarProps) => {
    const router = useRouter();
    const menuItemBaseStyle = 'flex justify-start gap-2 pl-2';
    const { clearPermissions } = usePermissionsStore();
    const { clearMenu } = useMenuStore();

    const handleLogout = () => {
        signOut()
            .then(() => {
                router.push('/auth/login');
                clearMenu();
                clearClientSideCookies();
                clearPermissions();
            })
            .catch((error) => {
                toast({
                    title: 'Terjadi kesalahan',
                    description: error.message,
                });
            });
    };
    return (
        <Section className="w-[16em] h-max hidden lg:block">
            <p>Menu Pengguna</p>
            <Separator className="mt-3" />
            <div className="flex flex-col gap-2.5 mt-3">
                {userMenus.map((menu: UserMenu, i: number) => {
                    return (
                        <Button
                            key={i}
                            className={
                                menu.value === activeUserMenu ? menuItemBaseStyle : `${menuItemBaseStyle} text-gray-500`
                            }
                            onClick={() => setActiveUserMenu(menu.value)}
                            variant={menu.value === activeUserMenu ? 'default' : 'ghost'}
                        >
                            <menu.icon className="w-5 h-5" />
                            {menu.label}
                        </Button>
                    );
                })}
                <Button className="flex justify-start gap-2 pl-2 text-gray-500" onClick={handleLogout} variant="ghost">
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </Section>
    );
};

export default UserSidebarMenu;
