import { UserMenuEnum } from '@/enums/user-menu';
import { UserMenu } from '@/types/user-menu';
import { FileText, MonitorUp, User } from 'lucide-react';

export const userMenus: UserMenu[] = [
    { label: 'Akun Pengguna', value: UserMenuEnum.ACCOUNT, icon: User },
    { label: 'Data Pegawai', value: UserMenuEnum.PERSONAL_DATA, icon: FileText },
    { label: 'Permintaan Akses', value: UserMenuEnum.REQUEST_ACCESS_MENU, icon: MonitorUp },
];
