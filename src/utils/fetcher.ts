import {generateSignature} from '@/lib/crypto-js/cipher';
import axios, {AxiosResponse} from 'axios';

export const fetcher = async (url: string, accessToken: string) => {
    const currentHeader: Record<string, string | null | undefined> = {
        'client-signature': generateSignature(),
        'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
    };

    if (accessToken) {
        currentHeader['Authorization'] = `Bearer ${accessToken}`;
    }

    const result: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
        headers: currentHeader,
    });

    return result?.data?.data;
};
