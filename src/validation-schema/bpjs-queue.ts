import z from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const phoneNumberRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export const bpjsQueueAddValidation = z
    .object({
        jenispasien: z.string({ message: 'Jenis pasien harus diisi' }).refine(
            (value) => {
                if (['JKN', 'NON JKN'].includes(value)) return false;
            },
            { message: 'Jenis pasien harus JKN / NON JKN' }
        ),
        nomorkartu: z.string({ message: 'Nomor kartu harus di isi' }).nullish(),
        nik: z
            .string({ message: 'Nomor NIK harus diisi' })
            .min(16, { message: 'Nomor NIK harus 16 digit' })
            .max(16, { message: 'Nomor NIK harus 16 digit' }),
        nohp: z
            .string({ message: 'Nomor hp harus diisi' })
            .regex(phoneNumberRegex, 'Nomor hp harus berupa nomor telepon yang valid'),
        kodepoli: z.string({ message: 'Kode poli harus diisi' }).min(3, { message: 'Kode poli harus diisi' }),
        namapoli: z
            .string({ message: 'Nama poliklinik harus diisi' })
            .min(4, { message: 'Nama poliklinik minimal 4 karakter' }),
        pasienbaru: z.number({ message: 'Status pasien baru/lama harus diisi' }).refine(
            (value) => {
                if (![1, 0].includes(Number(value))) return false;
            },
            { message: 'Pesien baru/lama tidak valid' }
        ),
        norm: z
            .string({ message: 'Kode RM harus diisi' })
            .min(7, { message: 'Kode RM harus 7 digit' })
            .max(7, { message: 'Kode RM harus 7 digit' }),
        tanggalperiksa: z.string({ message: 'Taggal periksa tidak valid' }).refine(
            (value) => {
                if (!dateRegex.test(value)) return false;
                return true;
            },
            { message: 'Format tanggal periksa harus yyyy-mm-dd' }
        ),
        kodedokter: z
            .number({ message: 'Kode dokter harus berupa nomor' })
            .min(4, { message: 'Kode dokter minimal 4 digit' }),
        namadokter: z
            .string({ message: 'Nama dokter harus berupa teks' })
            .min(4, { message: 'Nama dokter minimal 4 karakter' }),
        jeniskunjungan: z.number({ message: 'Jenis kunjungan harus berupa angka' }).refine(
            (value) => {
                if (![1, 2, 3, 4].includes(value)) return false;
            },
            { message: 'Jenis kunjungan tidak valid' }
        ),
        nomorreferensi: z.string({ message: 'Nomor referensi harus diisi' }).min(10, {
            message: 'Nomor referensi harus diisi dan minimal 10 karakter',
        }),
        nomorantrean: z
            .string({ message: 'Nomor antrean harus berupa teks' })
            .min(2, { message: 'Nomor antrean harus diisi' }),
        angkaantrean: z.number({ message: 'Angka antrean harus berupa angka' }),
    })
    .refine(
        (value) => {
            if (value.jenispasien === 'JKN' && !value?.nomorkartu) return false;
            if (value.jenispasien === 'JKN' && value?.nomorkartu && value?.nomorkartu.length !== 13) return false;
        },
        {
            message: 'Pasien BPJS wajib menyertakan nomor kartu, dan harus 13 digit',
        }
    )
    .refine(
        (value) => {
            if (value.jenispasien === 'JKN' && value.jeniskunjungan !== 1) return false;
        },
        { message: 'Selain rujukan FKTP No rujuk balik/kontrol harus diisi' }
    );
