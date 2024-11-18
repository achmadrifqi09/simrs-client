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
        .regex(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
            message: 'Jam buka praktek harus berformat HH:mm:ss',
        }),
    jam_tutup_praktek: z
        .string()
        .regex(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, {
            message: 'Jam tutup praktek harus berformat HH:mm:ss',
        }),
    kuota_mjkn: z.string({message: 'Kuota MJKN harus di isi'}),
    kuota_online_umum: z.string({message: 'Kuota online umum harus di isi'}),
    kuota_onsite: z.string({message: 'Kuota onsite harus di isi'}),
});

const vacationScheduleValidation = z.object ({
    keterangan_libur: z.string()
        .min(4, {message: 'Keterangan Minimal 4 Karakter'})
})

const quotaValidation = z.object({
    kuota_mjkn: z.string({message: 'Kuota MJKN harus di isi'}),
    kuota_online_umum: z.string({message: 'Kuota online umum harus di isi'}),
    kuota_onsite: z.string({message: 'Kuota onsite harus di isi'})
})
export {
    doctorScheduleValidation,
    vacationScheduleValidation,
    quotaValidation
};
