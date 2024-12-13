export type PatientReference = {
    asalFaskes: string;
    rujukan: Reference[];
};

export type Reference = {
    noKunjungan: string;
    tglKunjungan: string;
    keluhan: string;
    provPerujuk: provPerujuk;
    peserta: Participant;
};

export type provPerujuk = {
    kode: string;
    nama: string;
};

export type Participant = {
    nama: string;
    nik: string;
    noKartu: string;
    tglLahir: string;
    mr: MR;
};

export type MR = {
    noMR: string | null;
    noTelepon: string | null;
};
