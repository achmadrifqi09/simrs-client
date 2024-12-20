import { Control, UseFormSetValue } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Diagnosis } from '@/types/bpjs-diagnosis';
import useGet from '@/hooks/use-get';

interface GeneralSEPFormProps {
    control: Control<FormSEP>;
    setValue: UseFormSetValue<FormSEP>;
}

const GeneralSEPForm = ({ control, setValue }: GeneralSEPFormProps) => {
    const [initialDiagnosis, setInitalDiagnosis] = useState<string>('');
    const [diagnosisUrl, setDiagnosisUrl] = useState<string>('');
    const [openDiagnosisSelect, setOpenDiagnosisSelect] = useState<boolean>(false);
    const { data: diagnosis, getData: fetchDiagnosis } = useGet<Diagnosis[]>({ url: diagnosisUrl, firstLoad: false });

    const handleChangeDiagnosis = (value: string) => {
        setInitalDiagnosis(value);
        if (value.length >= 3) {
            setDiagnosisUrl(`/bpjs/v-claim/reference/diagnosis/${value}`);
        }
    };

    const handleDiagnosisSelect = (value: Diagnosis) => {
        setValue('diagAwal', value.kode);
        setInitalDiagnosis(value.kode);
        setOpenDiagnosisSelect(false);
    };

    useEffect(() => {
        if (diagnosisUrl !== '') {
            fetchDiagnosis().then(() => {
                setDiagnosisUrl('');
            });
        }
    }, [diagnosisUrl]);

    useEffect(() => {
        setInitalDiagnosis(control._getWatch('diagAwal'));
    }, [control._getWatch('diagAwal')]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
            <FormField
                control={control}
                name="noKartu"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">No BPJS*</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="tglSep"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Tanggal SEP*</FormLabel>
                            <FormControl>
                                <Input type="date" className="block" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="jnsPelayanan"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Jenis Layanan*</FormLabel>
                            <Select value={field?.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Jenis pelayanan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Rawat Inap</SelectItem>
                                    <SelectItem value="2">Rawat Jalan</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="noMR"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">No MR*</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" className="block" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="dpjpLayan"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Dokter DPJP*</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="cob"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">COB *</FormLabel>
                            <FormControl>
                                <Select value={field?.value || '0'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status COB" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Tidak</SelectItem>
                                        <SelectItem value="1">Ya</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="katarak"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Katarak*</FormLabel>
                            <FormControl>
                                <Select value={field?.value || '0'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih .." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Tidak</SelectItem>
                                        <SelectItem value="1">Ya</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="tujuanKunj"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Tujuan Kunjungan*</FormLabel>
                            <FormControl>
                                <Select value={field?.value || ''} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih .." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Normal</SelectItem>
                                        <SelectItem value="1">Prosedur</SelectItem>
                                        <SelectItem value="2">Konsul Dokter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="flagProcedure"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Flag Procedure</FormLabel>
                            <FormControl>
                                <div>
                                    <Select value={field?.value || ''} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih .." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Prosedur Tidak Berkelanjutan</SelectItem>
                                            <SelectItem value="1">Prosedur dan Terapi Berkelanjutan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Tidak perlu diisi jika tujuan kunjungan <b>Normal</b>
                                    </p>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="kdPenunjang"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">KD Penunjang</FormLabel>
                            <FormControl>
                                <div>
                                    <Select value={field?.value || ''} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih .." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Radioterapi</SelectItem>
                                            <SelectItem value="2">Kemoterapi</SelectItem>
                                            <SelectItem value="3">Rehabilitasi Medik</SelectItem>
                                            <SelectItem value="4">Rehabilitasi Psikososial</SelectItem>
                                            <SelectItem value="5">Transfusi Darah</SelectItem>
                                            <SelectItem value="6">Pelayanan Gigi</SelectItem>
                                            <SelectItem value="7">Laboratorium</SelectItem>
                                            <SelectItem value="8">USG</SelectItem>
                                            <SelectItem value="9">Farmasi</SelectItem>
                                            <SelectItem value="10">Lain-Lain</SelectItem>
                                            <SelectItem value="11">MRI</SelectItem>
                                            <SelectItem value="12">HEMODIALISA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Tidak perlu diisi jika tujuan kunjungan <b>Normal</b>
                                    </p>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="assesmentPel"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Assesmen Pelaksana</FormLabel>
                            <FormControl>
                                <div>
                                    <Select value={field?.value || ''} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih .." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Poli spesialis tidak tersedia pada hari sebelumnya
                                            </SelectItem>
                                            <SelectItem value="2">
                                                Jam Poli telah berakhir pada hari sebelumnya
                                            </SelectItem>
                                            <SelectItem value="3">
                                                Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya
                                            </SelectItem>
                                            <SelectItem value="4">Atas Instruksi RS</SelectItem>
                                            <SelectItem value="5">Tujuan Kontrol</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Jika tujuan kunjungan Normal/Konsul dokter assesment pelaksana harus di isi
                                    </p>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />

            <FormField
                control={control}
                name="noTelp"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">No telp*</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} value={field?.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="user"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Pembuat SEP*</FormLabel>
                            <FormControl>
                                <Input type="text" className="block" {...field} value={field?.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="ppkPelayanan"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">PKK Pelayanan*</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={control}
                name="catatan"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Catatan*</FormLabel>
                            <FormControl>
                                <Input type="text" className="block" {...field} value={field?.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />

            <FormField
                control={control}
                name="diagAwal"
                render={() => {
                    return (
                        <FormItem>
                            <FormLabel className="text-left block">Diagnosa Awal*</FormLabel>
                            <FormControl>
                                <div className="relative z-10">
                                    <Input
                                        value={initialDiagnosis}
                                        onFocus={() => setOpenDiagnosisSelect(true)}
                                        onChange={(e) => handleChangeDiagnosis(e.target.value)}
                                    />
                                    <p className="text-sm font-medium mt-1.5 text-red-500">
                                        {control.getFieldState('diagAwal')?.error
                                            ? control.getFieldState('diagAwal').error?.message
                                            : ''}
                                    </p>
                                    <div
                                        className={
                                            openDiagnosisSelect && diagnosis
                                                ? 'absolute w-full text-sm z-20 max-h-40 overflow-scroll bg-white p-1.5 shadow rounded border border-gray-100 top-[48px]'
                                                : 'hidden'
                                        }
                                    >
                                        {diagnosis &&
                                            diagnosis?.map((value: Diagnosis, x: number) => {
                                                return (
                                                    <button
                                                        key={x}
                                                        onClick={() => handleDiagnosisSelect(value)}
                                                        type="button"
                                                        className="p-2 hover:bg-gray-50 rounded w-full text-left"
                                                    >
                                                        {value.nama}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                    {/* )} */}
                                </div>
                            </FormControl>
                        </FormItem>
                    );
                }}
            />
        </div>
    );
};

export default GeneralSEPForm;
