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

export type { CallingCounter, Counter };
