import z from 'zod';

const counterValidation = z.object({
    nama_loket: z
        .string({ message: 'Nama loket harus di isi' })
        .min(3, { message: 'Nama loket minimal 3 karakter' }),
    keterangan: z.string().nullable(),
    status: z.string().min(1, {message: 'Status loket harus di isi'}),
    jenis_loket: z.string( { message: 'Jenis loket tidak valid' }),
});

export {counterValidation}