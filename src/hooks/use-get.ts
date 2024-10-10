import axios, {AxiosResponse} from "axios";
import {useCallback, useEffect, useState} from "react";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import {NextAuthSession} from "@/types/session";
import {useSession} from "next-auth/react";

type GetProps = {
    url: string,
    headers?: Record<string, string>,
    keyword?: string,
    cursor?: number,
    take?: number,
}

const useGet = <T>({url, headers, keyword, cursor, take}: GetProps) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | object>();
    const {data: session, status} = useSession() as { data: NextAuthSession, status: string };

    const getData = useCallback(async () => {
        if (status === 'authenticated') {
            setLoading(true);
            let endpoint = keyword ? `${url}?keyword=${keyword}` : url;


            if(cursor !== null && take) {
                endpoint = endpoint + `${keyword ? '&' : '?cursor='}${cursor}&take=${take}`;
            }
            try {
                const currentHeader: Record<string, string | null | undefined> = {
                    'client-signature': generateClientKey(),
                    'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                    ...headers,
                };
                if (session?.accessToken) {
                    currentHeader['Authorization'] = `Bearer ${session.accessToken}`;
                }

                const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                    headers: currentHeader
                })
                setData(response.data.data)
            } catch (error: any) {
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
    }, [getData, status])

    return {data, loading, error, getData}
}

export default useGet;