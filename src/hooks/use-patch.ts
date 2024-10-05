
import {useState} from "react";
import {useSession} from "next-auth/react";
import {NextAuthSession} from "@/types/session";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import axios, {AxiosResponse} from "axios";

const usePatch = <T>() => {
    const [patchLoading, setPatchLoading] = useState<boolean>(false);
    const [patchError, setPatchError] = useState<string | object | [] | null>(null);
    const { data: session } = useSession() as { data: NextAuthSession };

    const updateData = async (url: string, body: T, headers?: object) => {
        setPatchLoading(true);
        try {
            const currentHeader: Record<string, string | null| undefined> = {
                'client-signature': generateClientKey(),
                'client-id' : process.env.NEXT_PUBLIC_CLIENT_ID,
                ...headers,
            };
            if (session?.apiToken) {
                currentHeader['Authorization'] = `Bearer ${session.apiToken}`;
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
            setPatchError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga');
        } finally {
            setPatchLoading(false);
        }
    };

    return { updateData, patchLoading, patchError };
}

export { usePatch };