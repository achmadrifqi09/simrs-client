import {Permission} from "@/types/permission";

export function setUserPermissions(permissions: Permission[]): void {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('user_permissions', JSON.stringify(permissions));
        } catch (error) {
            console.error('Error saving permissions to localStorage:', error);
        }
    }
}

export function getUserPermissions(): Permission[] {
    if (typeof window !== 'undefined') {
        try {
            const storedPermissions = localStorage.getItem('user_permissions');
            return storedPermissions ? JSON.parse(storedPermissions) : [];
        } catch (error) {
            console.error('Error getting permissions from localStorage:', error);
            return [];
        }
    }
    return [];
}

export function clearUserPermissions(): void {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem('user_permissions');
        } catch (error) {
            console.error('Error clearing permissions from localStorage:', error);
        }
    }
}