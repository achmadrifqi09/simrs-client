import { CounterDisplayWS } from "@/types/admission-queue";

const AUDIO_PATH = '/audios';
const AUDIO_EXT = '.mp3';

interface AudioSegments {
    BELAS: string;
    PULUH: string;
    RATUS: string;
    MENUJU_LOKET: string;
}

const AudioPaths: AudioSegments = {
    BELAS: `${AUDIO_PATH}/belas${AUDIO_EXT}`,
    PULUH: `${AUDIO_PATH}/puluh${AUDIO_EXT}`,
    RATUS: `${AUDIO_PATH}/ratus${AUDIO_EXT}`,
    MENUJU_LOKET: `${AUDIO_PATH}/menuju_loket${AUDIO_EXT}`,
};

const getNumberAudioPath = (num: number): string => `${AUDIO_PATH}/${num}${AUDIO_EXT}`;

const handleTeens = (num: number, audios: string[]): void => {
    if (num === 10) {
        audios.push(getNumberAudioPath(10));
    } else if (num === 11) {
        audios.push(getNumberAudioPath(11));
    } else {
        audios.push(getNumberAudioPath(Number(num.toString()[1])));
        audios.push(AudioPaths.BELAS);
    }
};

const handleTensAndOnes = (num: number, audios: string[]): void => {
    const tensDigit = Number(num.toString()[0]);
    const onesDigit = Number(num.toString()[1]);

    audios.push(getNumberAudioPath(tensDigit));
    audios.push(AudioPaths.PULUH);

    if (onesDigit !== 0) {
        audios.push(getNumberAudioPath(onesDigit));
    }
};

const processNumber = (num: number, audios: string[]): void => {
    if (num < 10) {
        audios.push(getNumberAudioPath(num));
    } else if (num < 20) {
        handleTeens(num, audios);
    } else {
        handleTensAndOnes(num, audios);
    }
};

const processHundreds = (num: number, audios: string[]): void => {
    const hundredsDigit = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundredsDigit === 1) {
        audios.push(getNumberAudioPath(100));
    } else {
        audios.push(getNumberAudioPath(hundredsDigit));
        audios.push(AudioPaths.RATUS);
    }

    if (remainder > 0) {
        processNumber(remainder, audios);
    }
};

export const buildAudioResource = (counter: CounterDisplayWS): string[] => {
    const audios: string[] = [];
    const queueNumber = Number(counter.antrian[0]?.no_antrian);

    audios.push(`${AUDIO_PATH}/${counter.antrian[0]?.kode_antrian}${AUDIO_EXT}`);
    if (queueNumber < 100) {
        processNumber(queueNumber, audios);
    } else if (queueNumber < 1000) {
        processHundreds(queueNumber, audios);
    }

    audios.push(AudioPaths.MENUJU_LOKET);
    audios.push(`${AUDIO_PATH}/${counter.nama_loket.split(' ')[1]}${AUDIO_EXT}`);

    return audios;
};