import axios, {AxiosResponse, isAxiosError} from "axios";
import {useCallback, useEffect, useState} from "react";
import {generateSignature} from "@/lib/crypto-js/cipher";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

type GetProps = {
    url: string,
    headers?: Record<string, string>,
    keyword?: string,
    cursor?: number,
    take?: number,
    isGuest?: boolean,
}

const useGet = <T>({isGuest = false, url, headers, keyword, cursor, take}: GetProps) => {
    const router = useRouter();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | object>();
    const {data: session, status} = useSession();

    const getData = useCallback(async () => {
        if (status === 'unauthenticated' && isGuest === false) await signOut();
        if (status === 'authenticated' || isGuest) {
            setLoading(true);
            let endpoint = keyword ? `${url}${url.includes('?') ? '&' : '?'}keyword=${keyword}` : url;
            if (cursor !== null && take) {
                endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}cursor=${cursor}&take=${take}`;
            }
            try {
                const currentHeader: Record<string, string | null | undefined> = {
                    'client-signature': generateSignature(),
                    'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                    ...headers,
                };
                if (session?.accessToken && !isGuest) {
                    currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
                }

                const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                    headers: currentHeader
                })

                setData(response.data.data)
            } catch (error: any) {
                if (isAxiosError(error) && error.status === 401) {
                    await signOut()
                    return router.push('/auth/login');
                }
                setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
            } finally {
                setLoading(false)
            }
        }
    }, [url, headers, keyword, session, take, cursor]);

    useEffect(() => {
        getData().catch((error) => {
            setError(error.message);
        });

    }, isGuest ? [] : [status, getData])

    return {data, loading, error, getData}
}

export default useGet;
