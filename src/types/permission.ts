export type Permission = {
    id: number;
    can_view: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_create: boolean;
    menu: {
        pathname: string;
        tag: string;
    }
}
