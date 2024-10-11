import {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {NextAuthSession} from "@/types/session";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import axios, {AxiosResponse, isAxiosError} from "axios";
import {useRouter} from "next/navigation";

const useDelete = () => {
    const router = useRouter();
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | object | [] | null>(null);
    const {data: session} = useSession() as { data: NextAuthSession };

    const deleteData = async (url: string, headers?: object) => {
        setDeleteLoading(true);
        try {
            const currentHeader: Record<string, string | null | undefined> = {
                'client-signature': generateClientKey(),
                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                ...headers,
            };
            if (session?.accessToken) {
                currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
            }

            const response: AxiosResponse = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
                {
                    headers: currentHeader
                }
            );
            return response.data
        } catch (error: any) {
            if (isAxiosError(error) && error.status === 401) {
                await signOut()
                return router.push('/login');
            }
            setDeleteError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setDeleteLoading(false);
        }
    }
    return {deleteData, deleteLoading, deleteError};
}

export {useDelete}