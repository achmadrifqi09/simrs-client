import {useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import axios, {AxiosResponse, isAxiosError} from "axios";
import {useRouter} from "next/navigation";

const usePatch = <T>() => {
    const router = useRouter();
    const [patchLoading, setPatchLoading] = useState<boolean>(false);
    const [patchError, setPatchError] = useState<string | object | [] | null>(null);
    const {data: session} = useSession();

    const updateData = async (url: string, body: T, headers?: object) => {
        setPatchLoading(true);
        setPatchError(null)
        try {
            const currentHeader: Record<string, string | null | undefined> = {
                'client-signature': generateClientKey(),
                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                ...headers,
            };
            if (session?.accessToken) {
                currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
            }

            const response: AxiosResponse = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
                body,
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
            setPatchError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setPatchLoading(false);
        }
    };

    return {updateData, patchLoading, patchError, setPatchError};
}

export {usePatch};