import { UserMenuEnum } from '@/enums/user-menu';
import { LucideIcon } from 'lucide-react';

export type UserMenu = {
    label: string;
    value: UserMenuEnum;
    icon: LucideIcon;
};
