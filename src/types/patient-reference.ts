export type PatientReference = {
    asalFaskes: string;
    rujukan: Reference[];
};

export type Reference = {
    noKunjungan: string;
    tglKunjungan: string;
    keluhan: string;
    provPerujuk: provPerujuk;
};

export type provPerujuk = {
    kode: string;
    nama: string;
};
