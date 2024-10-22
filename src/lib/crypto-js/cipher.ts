import AES from 'crypto-js/aes';
import moment from 'moment-timezone';
import {enc} from 'crypto-js';

const generateSignature = () => {
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY

    if(secretKey){
        return AES.encrypt(
            JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                timestamp: generateCurrentDate(),
            }),
            secretKey
        ).toString()
    }
    return null;
}

const generateCurrentDate = (): Date => {
    const createdAt = moment.tz('Asia/Jakarta');
    const finalDate = `${createdAt.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    return new Date(finalDate);
};

const encryptData = (encrypt: string) => {
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY
    if(secretKey){
        return AES.encrypt(
            encrypt,
            secretKey
        ).toString();
    }

    return null;
}

const decryptData = (encryptedString: string) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

    if (secretKey) {
        const bytes = AES.decrypt(encryptedString, secretKey);
        const result = bytes.toString(enc.Utf8);

        try {
            return result ? JSON.parse(result) : {};
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return {};
        }
    }

    return null;
}

export {generateSignature, encryptData, decryptData}