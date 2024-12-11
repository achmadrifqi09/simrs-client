import z from 'zod';

export const doctorBPJSFilter = z.object({
    specialist: z.string({ message: 'Harus diisi' }).min(1, { message: 'Spesialis dokter harus diisi' }),
    service_date: z.string({ message: 'Harus diisi' }).min(1, { message: 'Tanggal layanan dokter harus diisi' }),
    service_type: z.string({ message: 'Harus diisi' }).min(1, { message: 'Jenis layanan dokter harus diisi' }),
});
