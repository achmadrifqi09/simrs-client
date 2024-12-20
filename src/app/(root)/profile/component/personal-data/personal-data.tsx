import { Separator } from '@/components/ui/separator';

const PersonalData = () => {
    return (
        <>
            <p>Data Pegawai</p>
            <Separator className="mt-3 mb-2.5" />
            <p className="text-sm text-gray-500 mb-2">
                Task : memperbarui data pegawai seperti di menu pegawi update (hanya dapat memeperbarui user yang sedang
                login)
            </p>
        </>
    );
};

export default PersonalData;
