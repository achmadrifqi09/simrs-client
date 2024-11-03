import z from 'zod';

const doctorScheduleValidation = z.object({
    id_pegawai: z
        .string({message: 'Dokter harus di isi'})
        .min(1, {message: 'Dokter minimal 1 karakter'}),
    kode_instalasi_bpjs: z
        .string({message: 'Kode poli harus di isi'})
        .min(3, {message: 'Kode poli minimal 3 karakter'}),
    hari_praktek: z
        .string({message: 'Hari praktek harus di isi'})
        .min(1, {message: 'Hari praktek harus senin - minggu'})
        .max(7, {message: 'Hari praktek harus senin - minggu'})
        .nullish(),
    jam_buka_praktek: z
        .string()
        .regex(/^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d)( [APap][mM])?$/, {
            message: 'Jam buka praktek harus berformat HH:mm:ss',
        }),
    jam_tutup_praktek: z
        .string()
        .regex(/^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d)( [APap][mM])?$/, {
            message: 'Jam tutup praktek harus berformat HH:mm:ss',
        }),
    kuota_mjkn: z.string({message: 'Kuota MJKN harus di isi'}),
    kuota_online_umum: z.string({message: 'Kuota online umum harus di isi'}),
    kuota_onsite: z.string({message: 'Kuota onsite harus di isi'}),
});

export {doctorScheduleValidation};
