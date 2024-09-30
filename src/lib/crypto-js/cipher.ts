import AES from 'crypto-js/aes';
import moment from 'moment-timezone';

const generateClientKey = () => {
    const currentDate = moment.tz('Asia/Jakarta');
    const formatedDate = currentDate.format('YYYY-MM-DD HH:mm:ss')
    const secretKey =  process.env.NEXT_PUBLIC_SECRET_KEY

    if(secretKey){
        const clientKey = AES.encrypt(
            JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                timestamp: formatedDate,
            }),
            secretKey
        ).toString()
        console.log(clientKey)
        return clientKey;
    }
    return null;
}


export {generateClientKey}