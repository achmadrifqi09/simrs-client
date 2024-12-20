import z from 'zod';
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateSchema = z.string().regex(dateRegex, 'Format tanggal harus yyyy-mm-dd');

export const SEPValidationSchema = z
    .object({
        noKartu: z
            .string({ message: 'Nomor BPJS harus diisi' })
            .min(13, { message: 'Nomor BPJS harus 13 digit' })
            .max(13, { message: 'Nomor BPJS harus 13 digit' }),
        tglSep: z.string().default(new Date().toISOString().split('T')[0]),
        jnsPelayanan: z.string({ message: 'Jenis pelayanan harus diisi' }).refine(
            (value) => {
                if (['1', '2'].includes(value)) return true;
                return false;
            },
            { message: 'Jenis palayan harus 1. Rawat Inap, 2. Rawat Jalan' }
        ),
        klsRawatHak: z.string(),
        klsRawatNaik: z.string().nullish(),
        pembiayaan: z.string().nullish(),
        penanggungJawab: z.string(),
        noMR: z.string(),
        ppkPelayanan: z.string({ message: 'PKK Pelayanan harus diisi' }).min(4, { message: 'PKK Layanan harus diisi' }),
        asalRujukan: z.string({ message: 'Asal rujukan harus diisi' }).refine(
            (value) => {
                if (['1', '2'].includes(value)) return true;
                return false;
            },
            { message: 'Asal rujukan harus 1 untuk Faskes 2 untuk Faskes 2(RS)' }
        ),
        tglRujukan: dateSchema,
        noRujukan: z
            .string({ message: 'Nomor rujukan harus diisi' })
            .min(8, { message: 'Nomor rujukan miminal 8 digit' }),
        ppkRujukan: z.string({ message: 'PKK rujukan harus diisi' }).min(1, { message: 'PKK rujukan harus diisi' }),
        catatan: z.string({ message: 'Catatan harus diisi' }),
        diagAwal: z
            .string({ message: 'Diagnosa awal harus diisi (contoh A04)' })
            .min(2, { message: 'Diagnosa awal harus diisi (contoh A04)' }),
        tujuan: z.string({ message: 'Poli tujuan harus diisi' }).min(1, { message: 'Poli tujuan harus diisi' }),
        eksekutif: z.string({ message: 'Poli eksekutif harus diisi' }).refine(
            (value) => {
                if (['1', '0'].includes(value)) return true;
                return false;
            },
            { message: 'Poli eksekutif harus diisi' }
        ),
        cob: z.string().refine(
            (value) => {
                if (['1', '0'].includes(value)) return true;
                return false;
            },
            { message: 'COB harus 1 untuk Ya dan 2 untuk Tidak' }
        ),
        katarak: z.string().refine(
            (value) => {
                if (['1', '0'].includes(value)) return true;
                return false;
            },
            { message: 'Katarak harus 1 untuk Ya dan 2 untuk Tidak' }
        ),
        lakaLantas: z.string({ message: 'Laka lantas harus diisi' }).refine(
            (value) => {
                if (!['0', '1', '2', '3'].includes(value)) return false;
                return true;
            },
            { message: 'Laka lantas tidak valid' }
        ),
        noLP: z.string().nullish(),
        tglKejadian: z.string().nullish(),
        keterangan: z.string().nullish(),
        suplesi: z.string().nullish(),
        noSepSuplesi: z.string().nullish(),
        kdPropinsi: z.string().nullish(),
        kdKabupaten: z.string().nullish(),
        kdKecamatan: z.string().nullish(),
        tujuanKunj: z.string({ message: 'Tujuan kunjungan harus diisi' }).refine(
            (value) => {
                if (['0', '1', '2'].includes(value)) return true;
                return false;
            },
            { message: 'Tujuan kunjungan tidak valid, harus diisi' }
        ),
        flagProcedure: z.string().nullish(),
        kdPenunjang: z.string({ message: 'KD penunjang tidak valid' }).nullish(),
        noSurat: z.string({ message: 'No surat kontrol tidak valid' }).nullish(),
        assesmentPel: z.string().nullish(),
        kodeDPJP: z.string({ message: 'Kode DPJP dokter harus di isi' }),
        dpjpLayan: z.string().min(3, { message: 'Kode DPJP layanan harus diisi dan miminal 3 digit' }),
        noTelp: z.string({ message: 'No telepon harus diisi' }).min(8, { message: 'Nomor telepon minimal 8 digit' }),
        user: z
            .string({ message: 'Nama pembuat SEP harus diisi' })
            .min(3, { message: 'Nama pembuat SEP minimal 3 karakter' }),
    })
    .transform((values) => {
        if (values.tujuanKunj === '0') values.flagProcedure = '';
        return values;
    })
    .refine(
        (values) => {
            if (values.tujuanKunj !== '0' && !['0', '1'].includes(values.flagProcedure || '')) return false;
            return true;
        },
        {
            message: 'Jika tujuan kunjungan bukan normal maka flag procedure harus diisi',
            path: ['flagProcedure'],
        }
    )
    .transform((values) => {
        if (values.tujuanKunj === '0') values.kdPenunjang = '';
        return values;
    })
    .refine(
        (values) => {
            if (values.tujuanKunj !== '0' && !checkKdPenunjang(values.kdPenunjang)) return false;
            return true;
        },
        {
            message: 'Penunjang harus di isi jika tujuan kunjungan bukan normal',
            path: ['kdPenunjang'],
        }
    )
    .transform((values) => {
        if (values.jnsPelayanan === '1') values.dpjpLayan = '';
        return values;
    })
    // .refine(
    //     (values) => {
    //         if (['0', '2'].includes(values.tujuanKunj) && ['1', '2', '3', '4', '5'].includes(values.assesmentPel || ''))
    //             return true;
    //         return false;
    //     },
    //     {
    //         message: 'Jika tujuan kunjungan Normal/Konsul dokter assesment pelaksana harus di isi',
    //         path: ['assesmentPel'],
    //     }
    // )
    // .transform((values) => {
    //     if (!['0', '2'].includes(values.tujuanKunj)) values.assesmentPel = '';
    //     return values;
    // })
    .refine(
        (values) => {
            if (values.lakaLantas === '0') return true;
            if (values.lakaLantas !== '0' && dateRegex.test(values.tglKejadian || '')) return true;
            return false;
        },
        {
            message: 'Selain Bukan Kecelakaan lalu lintas, tgl kejadian harus diisi dengan format yyyy-mm-dd',
            path: ['tglKejadian'],
        }
    );

const checkKdPenunjang = (value: string | null | undefined): boolean => {
    switch (value) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '10':
        case '11':
        case '12':
            return true;
        default:
            return false;
    }
};
