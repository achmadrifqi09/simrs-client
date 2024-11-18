type CallingCounter = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    jenis_loket: number;
    is_used?: boolean;
}

type Counter = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    status: number;
    keterangan: string | undefined;
    jenis_loket: number;
}

type CounterWS = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    jenis_loket: number;
    is_used?: boolean;
};

export type { CallingCounter, Counter, CounterWS };
