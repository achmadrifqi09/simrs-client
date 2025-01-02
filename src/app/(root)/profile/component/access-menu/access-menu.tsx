import { Separator } from '@/components/ui/separator';

const AccessMenu = () => {
    return (
        <>
            <p>Permintaan Akses Menu</p>
            <Separator className="mt-3 mb-2.5" />
            <p className="text-sm text-gray-500 mb-2">
                Task : melakukan permintaan akses menu ke admins sistem (ex: user a meminta admin untuk memberikan akses
                pendaftaran)
            </p>
        </>
    );
};

export default AccessMenu;
