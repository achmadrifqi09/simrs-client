
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserPermissions, clearUserPermissions } from '@/utils/permissionUtils';
import {Permission} from "@/types/permission";

export function useUserPermissions() {
    const { data: session } = useSession();
    const [permissions, setPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        if (session) {
            const storedPermissions = getUserPermissions();
            setPermissions(storedPermissions);
        } else {
            setPermissions([]);
        }
    }, [session]);

    const getPermission = (tag: string) => {
        return permissions.forEach((permission) => {
            if (permission.menu.tag === tag) {
                return permission;
            }
        })
    }

    const refreshPermissions = () => {
        const storedPermissions = getUserPermissions();
        setPermissions(storedPermissions);
    };

    return { permissions, refreshPermissions, clearPermissions: clearUserPermissions, getPermission };
}
