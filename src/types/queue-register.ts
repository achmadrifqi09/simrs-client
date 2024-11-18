export type QueueInputPayload = {
    nama_pasien: string;
    jenis_pasien: number;
    jenis_penjamin: number;
    no_bpjs?: string;
    no_hp: string;
    id_jadwal_dokter: number;
    tgl_lahir: string;
    kode_rm?: string;
}

export type RegisterResponse = {
    nama_pasien: string;
    jenis_pasien: number;
    jenis_penjamin: number;
    no_bpjs?: string;
    no_hp?: string;
    id_jadwal_dokter: number;
    tgl_lahir: Date;
    kode_antrian: string;
    no_antrian: number;
    status: number;
    status_panggil: number;
    sisa_antrian_onsite: number;
    dokter: string;
    poliklinik: string;
    created_at: string;
}
