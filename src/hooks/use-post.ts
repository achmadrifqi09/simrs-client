import {useState} from "react";
import axios, {AxiosResponse} from "axios";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import {NextAuthSession} from "@/types/session";
import {useSession} from "next-auth/react";


const usePost = <T>(url: string) => {
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [postError, setPostError] = useState<string | object | null>(null);
    const { data: session } = useSession() as { data: NextAuthSession };

    const postData = async (body: T, headers?: object) => {
        setPostLoading(true);
        try {
            const currentHeader: Record<string, string | null> = {
                'client-key': generateClientKey(),
                ...headers,
            };
            if (session?.accessToken) {
                currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
            }
            console.log(currentHeader)

            const response: AxiosResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
                body,
                {
                   headers: currentHeader
                }
            );
            return response.data
        } catch (error: any) {
            setPostError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setPostLoading(false);
        }
    };

    return { postData, postLoading, postError};
};

export {usePost};
