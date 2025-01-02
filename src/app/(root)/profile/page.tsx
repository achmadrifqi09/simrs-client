'use client';
import Section from '@/components/ui/section';
import UserSidebarMenu from './component/sidebar-menu';
import { useState } from 'react';
import { UserMenuEnum } from '@/enums/user-menu';
import UserTopbarMenu from './component/top-bar-menu';
import Account from './component/account/account';
import PersonalData from './component/personal-data/personal-data';
import AccessMenu from './component/access-menu/access-menu';

const User = () => {
    const [activeUserMenu, setActiveUserMenu] = useState<UserMenuEnum>(UserMenuEnum.ACCOUNT);
    return (
        <div className="flex gap-6 mt-4">
            <UserSidebarMenu setActiveUserMenu={setActiveUserMenu} activeUserMenu={activeUserMenu} />
            <div className="w-full h-max">
                <UserTopbarMenu setActiveUserMenu={setActiveUserMenu} activeUserMenu={activeUserMenu} />
                <Section className="w-full h-max">
                    {activeUserMenu === UserMenuEnum.ACCOUNT && <Account />}
                    {activeUserMenu === UserMenuEnum.PERSONAL_DATA && <PersonalData />}
                    {activeUserMenu === UserMenuEnum.REQUEST_ACCESS_MENU && <AccessMenu />}
                </Section>
            </div>
        </div>
    );
};

export default User;
