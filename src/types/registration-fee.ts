export type RegistrationFee = {
    id: number;
    id_pendaftaran: number;
    biaya_daftar: string;
    diskon_daftar?: string;
    biaya_kartu?: string;
    diskon_kartu?: string;
    biaya_dokter: string;
    diskon_dokter?: string;
    total_biaya: string;
    tgl_billing_daftar?: Date;
    tgl_billing_daftar_selesai?: Date;
    created_at: Date;
};
