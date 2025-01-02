import { Separator } from '@/components/ui/separator';
import DeleteAccountConfirmation from './delete-account-confirmation';

const Account = () => {
    return (
        <>
            <p>Akun Pengguna</p>
            <Separator className="mt-3 mb-2.5" />
            <div>
                <p className="text-sm text-gray-500 mb-2">Task : ganti email/hp, ganti password, hapus akun</p>
                <DeleteAccountConfirmation />
            </div>
        </>
    );
};

export default Account;
