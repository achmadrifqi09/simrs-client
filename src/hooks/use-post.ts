import {useState} from "react";
import axios, {AxiosResponse, isAxiosError} from "axios";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const usePost = <T>(url: string) => {
    const router = useRouter();
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [postError, setPostError] = useState<string | object | [] | null>(null);
    const {data: session} = useSession();

    const postData = async (body: T, headers?: object) => {
        setPostLoading(true);
        setPostError(null)
        try {
            const currentHeader: Record<string, string | null | undefined> = {
                'client-signature': generateClientKey(),
                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                ...headers,
            };
            if (session?.accessToken) {
                currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
            }

            const response: AxiosResponse = await axios.post(
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
            setPostError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setPostLoading(false);
        }
    };


    return {postData, postLoading, postError, setPostError};
};

export {usePost};
