import {generateSignature} from "@/lib/crypto-js/cipher";
import axios, {AxiosResponse} from "axios";
import React from "react";

const useFile = () => {
    const [fileError, setFileError] = React.useState<string | null>(null);
    const fetchFile = async (pathname: string) => {
        try {
            const currentHeader: Record<string, string | null | undefined> = {
                'client-signature': generateSignature(),
                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
            };

            const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${pathname}`, {
                responseType: 'blob',
                headers: currentHeader
            })

            return response.data;
        } catch (error: any) {
            setFileError(error?.response?.data?.errors || error?.message || 'Terjadi kesalahan yang tidak terduga')
        }
    }

    return {fetchFile, fileError}
}

export default useFile;
