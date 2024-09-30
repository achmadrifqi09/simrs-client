import {useState} from "react";
import axios, {AxiosResponse} from "axios";
import {generateClientKey} from "@/lib/crypto-js/cipher";

type PostProps<T> = {
    endpoint: string,
    headers?: Record<string, string>,
    body: T,
}

const usePost = <T>({endpoint, headers, body}: PostProps<T>) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | object>();


    const postData = async () => {
        setLoading(true)
        try {
            const response: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
                headers: {
                    'client-key': generateClientKey(),
                    ...headers
                },
                body
            })

           setData(response.data.data)
        } catch (error: any) {
            setError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
        } finally {
            setLoading(false)
        }
    }

    return {data, postData, loading, error}
}

export {usePost}