export type BPJSQueueAdd = {
    idantrian: number;
    idpendaftaran: number;
    jenispasien: string;
    nomorkartu: string | undefined;
    nik: string;
    nohp: string;
    kodepoli: string;
    namapoli: string;
    pasienbaru: number;
    norm: string;
    tanggalperiksa: string;
    kodedokter: number;
    namadokter: string;
    jampraktek: string;
    jeniskunjungan: number;
    nomorreferensi: string;
    nomorantrean: string;
    angkaantrean: number;
};

export type BPJSTaskId = {
    kodebooking: string;
    taskid: number;
    waktu: number;
    jenisresep?: string;
};
