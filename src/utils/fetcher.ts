import { generateClientKey } from '@/lib/crypto-js/cipher';
import axios, { AxiosResponse } from 'axios';

export const fetcher = async ([url, apiToken, status]: [string, string | null, string]) => {
    const currentHeader: Record<string, string | null | undefined> = {
        'client-signature': generateClientKey(),
        'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
    };

    if (apiToken) {
        currentHeader['Authorization'] = `Bearer ${apiToken}`;
    }

    if (status === 'authenticated') {
        const result: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
            headers: currentHeader,
        });
        return result?.data?.data;
    }

    return [];
};
