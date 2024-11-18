export class EmployeeDTO {
    id_pegawai!: number;
    no_reg!: string;
    nip_pegawai!: number;
    nip_pns!: number;
    gelar_depan!: string;
    gelar_belakang!: string;
    nama_pegawai!: string;
    id_ms_negara_asal!: number;
    id_ms_provinsi_asal!: number;
    id_ms_kota_asal!: number;
    id_ms_kecamatan_asal!: number;
    id_ms_desa_asal!: number;
    alamat_asal!: string;
    kode_pos_asal!: string;
    rt_asal!: string;
    rw_asal!: string;
    id_ms_negara_tinggal!: number;
    id_ms_provinsi_tinggal!: number;
    id_ms_kota_tinggal!: number;
    id_ms_kecamatan_tinggal!: number;
    id_ms_desa_tinggal!: number;
    alamat_tinggal!: string;
    kode_pos_tinggal!: string;
    rt_tinggal!: string;
    rw_tinggal!: string;
    tempat_lahir!: string;
    tgl_lahir!: Date;
    id_jenis_kelamin!: number;
    id_ms_golongan_darah!: number;
    id_ms_status_kawin!: number;
    id_ms_agama!: number;
    id_ms_pendidikan!: number;
    id_ms_jenis_pegawai!: number;
    id_ms_status_pegawai!: number;
    id_ms_spesialis!: number;
    id_unit_induk!: number;
    id_pangkat!: number;
    id_jabatan!: number;
    id_unit_jabatan!: number;
    id_gaji!: number;
    pjs!: number;
    hp!: string;
    email!: string;
    no_npwp!: string;
    no_ktp!: string;
    foto!: string;
    kode_arsip!: string;
    id_finger!: number;
    kode_dpjp!: string;
    tgl_masuk!: Date;
    tgl_keluar!: Date;
    status_pns!: number;
    status_aktif!: number;
    id_pelamar?: number;

    constructor(data?: Partial<EmployeeDTO>) {
        Object.assign(this, {
            id_pegawai: 0,
            no_reg: "",
            nip_pegawai: 0,
            nip_pns: 0,
            gelar_depan: "",
            gelar_belakang: "",
            nama_pegawai: "",
            id_ms_negara_asal: 0,
            id_ms_provinsi_asal: 0,
            id_ms_kota_asal: 0,
            id_ms_kecamatan_asal: 0,
            id_ms_desa_asal: 0,
            alamat_asal: "",
            kode_pos_asal: "",
            rt_asal: "",
            rw_asal: "",
            id_ms_negara_tinggal: 0,
            id_ms_provinsi_tinggal: 0,
            id_ms_kota_tinggal: 0,
            id_ms_kecamatan_tinggal: 0,
            id_ms_desa_tinggal: 0,
            alamat_tinggal: "",
            kode_pos_tinggal: "",
            rt_tinggal: "",
            rw_tinggal: "",
            tempat_lahir: "",
            tgl_lahir: new Date(),
            id_jenis_kelamin: 0,
            id_ms_golongan_darah: 0,
            id_ms_status_kawin: 0,
            id_ms_agama: 0,
            id_ms_pendidikan: 0,
            id_ms_jenis_pegawai: 0,
            id_ms_status_pegawai: 0,
            id_ms_spesialis: 0,
            id_unit_induk: 0,
            id_pangkat: 0,
            id_jabatan: 0,
            id_unit_jabatan: 0,
            id_gaji: 0,
            pjs: 0,
            hp: "",
            email: "",
            no_npwp: "",
            no_ktp: "",
            foto: "",
            kode_arsip: "",
            id_finger: 0,
            kode_dpjp: "",
            tgl_masuk: new Date(),
            tgl_keluar: new Date(),
            status_pns: 0,
            status_aktif: 1,
            id_pelamar: 0,
            ...data
        });
    }

    getData (){
        return {
            nama_pegawai: this.nama_pegawai,

        }
    }
}
