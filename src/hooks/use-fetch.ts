import axios, {AxiosResponse} from "axios";
import {useCallback, useEffect, useState} from "react";
import {generateClientKey} from "@/lib/crypto-js/cipher";

type FetchProps = {
    url: string,
    headers?: Record<string, string>,
    keyword?: string,
}

const useFetch = <T>({url, headers, keyword}: FetchProps) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | object>();

    const fetchData = useCallback(async () => {
        setLoading(true);
        const endpoint = keyword ? `${url}?keyword=${keyword}` : url;

        try {
            const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                headers: {
                    'client-key':generateClientKey(),
                    ...headers
                },
            })
            setData(response.data.data)
        } catch (error: any) {
            setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
        } finally {
            setLoading(false)
        }
    }, [url, headers, keyword]);

    useEffect(() => {
        fetchData().catch((error) => {
            setError(error.message);
        });
    }, [fetchData])

    return {data, loading, error}
}

export default useFetch;