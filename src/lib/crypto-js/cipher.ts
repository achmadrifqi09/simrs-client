import AES from 'crypto-js/aes';
import moment from 'moment-timezone';

const generateClientKey = () => {
    const currentDate = moment.tz('Asia/Jakarta');
    const formatedDate = currentDate.format('YYYY-MM-DD HH:mm:ss')
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY

    if(secretKey){
        const signature = AES.encrypt(
            JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                timestamp: formatedDate,
            }),
            secretKey
        ).toString();
        console.log(signature);
        return signature
    }
    return null;
}

const encryptCookies = (encrypt: string) => {
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY
    if(secretKey){
        return AES.encrypt(
            encrypt,
            secretKey
        ).toString();
    }

    return null;
}

const decryptCookies = (decrypt: string) => {
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY
    if(secretKey){
        return JSON.parse(AES.decrypt(
            decrypt,
            secretKey
        ).toString())
    }

    return null;
}

export {generateClientKey, encryptCookies, decryptCookies}