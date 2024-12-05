import z from "zod";

const generalRegisterValidation = z.object({
        jenis_penjamin: z.number()
            .int()
            .min(1)
            .max(2, {message: 'Jenis Kelamin harus 1 ( Umum ) atau 2 ( BPJS )'}),
        no_asuransi: z.number()
            .int()
            .min(2)
            .max(100, {message: 'Nomor Asuransi maximal 100'}),
        pihak_kedua: z.number()
            .int(),
        no_asuransi_cob: z.number(),
        jenis_pasien: z.number(),
        biaya_pendaftaran: z.number()
            .min(1),
        biaya_kartu: z.number(),
        jasa_dokter: z.number()
            .min(1),
        tgl_kunjungan: z.string()
    }
)
export {
    generalRegisterValidation,
}
