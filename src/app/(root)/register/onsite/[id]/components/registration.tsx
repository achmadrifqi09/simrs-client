import Heading from '@/components/ui/heading';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FamilyStatus, Insurance } from '@/types/master';
import SelectSearch from '@/components/ui/select-search';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registrationValidation } from '@/validation-schema/registration';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Registration as RegistrationType } from '@/types/register';
import { registrationDefaultValue } from '@/const/registration-default-value';
import { Textarea } from '@/components/ui/textarea';
import { usePatch } from '@/hooks/use-patch';
import { Loader2 } from 'lucide-react';
import FormError from '@/components/ui/form-error';
import { PatientType } from '@/types/patient';
import SelectReference from './select-reference';

interface RegistrationProps {
    id: string;
    data: RegistrationType | null;
    patient: PatientType | null;
    onRefresh: () => void;
}

const Registration = ({ id, data, patient, onRefresh }: RegistrationProps) => {
    const { updateData, patchError, patchLoading } = usePatch();
    const registrationForm = useForm<z.infer<typeof registrationValidation>>({
        resolver: zodResolver(registrationValidation),
        defaultValues: registrationDefaultValue,
    });
    const [isSelectReferenceDialog, setIsReferenceDialog] = useState<boolean>(false);
    const { handleSubmit, control } = registrationForm;
    const formateDate = (date: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(date)) {
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        }
        return date;
    };
    const onSubmit = handleSubmit(async (values) => {
        delete values.jenis_pasien;
        const response = await updateData(`/registration/${id}`, {
            ...values,
            tgl_daftar: values?.tgl_daftar ? formateDate(values?.tgl_daftar) : undefined,
            tgl_rujukan:
                values?.tgl_rujukan && values?.tgl_rujukan !== ' ' ? formateDate(values?.tgl_rujukan) : undefined,
            status_rujukan: Number(values.status_rujukan) || undefined,
            id_asuransi: Number(values.id_asuransi) || undefined,
            cob: Number(values.cob) || undefined,
            id_hub_wali: Number(values.id_hub_wali) || undefined,
            no_rujukan: values?.no_rujukan && values.no_rujukan !== ' ' ? values.no_rujukan : undefined,
            nomor_asuransi: values?.nomor_asuransi && values.nomor_asuransi !== ' ' ? values.nomor_asuransi : undefined,
        });
        if (response?.status_code === 200) {
            onRefresh();
            toast({
                title: 'Berhasil',
                description: 'Pendaftaran berhasil',
            });
        }
    });

    const onSelectReference = (referenceNumber: string, referenceDate: string) => {
        registrationForm.setValue('no_rujukan', referenceNumber || '');
        registrationForm.setValue('tgl_rujukan', referenceDate || '');
        setIsReferenceDialog(false);
    };

    useEffect(() => {
        if (data && patient) {
            const formatDate = (date: string) => {
                const [year, month, day] = date.split('T')[0].split('-');
                return `${day}-${month}-${year}`;
            };
            registrationForm.reset({
                tgl_daftar: data?.tgl_daftar ? formatDate(data?.tgl_daftar) : '',
                jenis_pasien: data?.antrian?.jenis_pasien.toString() || '',
                id_asuransi: data.id_asuransi || undefined,
                nomor_asuransi:
                    Number(data.id_asuransi) === 1 ? data?.nomor_asuransi || patient?.no_bpjs || '' : undefined,
                no_rujukan: data?.no_rujukan || undefined,
            });
        }
    }, [data, patient]);

    return (
        <div className="mb-6">
            <Heading headingLevel="h6">Formulir Pendaftaran</Heading>
            <Form {...registrationForm}>
                <form onSubmit={onSubmit}>
                    <div className="xl:grid xl:grid-cols-2 xl:gap-4">
                        <FormField
                            control={control}
                            name="tgl_daftar"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Tanggal kunjungan*</FormLabel>
                                        <FormControl>
                                            <Input type="text" disabled={true} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="jenis_pasien"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Jenis pasien*</FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={true}
                                                value={field?.value || undefined}
                                                onValueChange={field.onChange}
                                                defaultValue={field?.value || undefined}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Jenis pasien" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">Lama</SelectItem>
                                                        <SelectItem value="2">Baru</SelectItem>
                                                    </SelectGroup>
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
                            name="id_asuransi"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Penjamin</FormLabel>
                                        <FormControl>
                                            <div className="w-full">
                                                <SelectSearch<Insurance>
                                                    url={`/master/insurance?is_bpjs=${
                                                        data?.antrian.jenis_penjamin == 2 ? '1' : '0'
                                                    }&status=1`}
                                                    labelName="nama_asuransi"
                                                    valueName="id"
                                                    placeholder="Pilih ..."
                                                    onChange={field.onChange}
                                                    defaultValue={Number(field.value) || undefined}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={control}
                            name="nomor_asuransi"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Nomor asuransi</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} value={field?.value || undefined} />
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
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>COB</FormLabel>
                                        <FormControl>
                                            <>
                                                <SelectSearch<Insurance>
                                                    url={`/master/insurance?is_bpjs=${
                                                        data?.antrian.jenis_penjamin == 2 ? '1' : '0'
                                                    }&status=1`}
                                                    labelName="nama_asuransi"
                                                    valueName="id"
                                                    placeholder="Pilih ..."
                                                    onChange={field.onChange}
                                                    defaultValue={field.value || undefined}
                                                />
                                                <p className="text-[12px] text-gray-500 ms-1">
                                                    Isikan jika pasien ditanggung oleh 2 pihak asuransi
                                                </p>
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="no_cob"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>No asuransi COB</FormLabel>
                                        <FormControl>
                                            <>
                                                <Input type="text" {...field} value={field?.value || undefined} />
                                                <p className="text-[12px] text-gray-500 ms-1">
                                                    Isikan jika pasien ditanggung oleh 2 pihak asuransi, sesuai dengan{' '}
                                                    <b>COB</b>
                                                </p>
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={control}
                            name="status_rujukan"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Jenis Rujukan/Kunjungan*</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field?.value?.toString() || undefined}
                                                onValueChange={field.onChange}
                                                defaultValue="1"
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Jenis rujukan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">Rujukan FKTP</SelectItem>
                                                        <SelectItem value="2">Rujukan Internal</SelectItem>
                                                        <SelectItem value="3">Kontrol</SelectItem>
                                                        <SelectItem value="4">Rujukan Antar RS</SelectItem>
                                                    </SelectGroup>
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
                            name="nomor_rujuk_balik"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>No rujuk balik/kontrol</FormLabel>
                                        <FormControl>
                                            <>
                                                <Input type="text" {...field} value={field?.value || ''} />
                                                <p className="text-[12px] text-gray-500 ms-1">
                                                    Isikan jika <b>jenis rujukan bukan FKTP</b>
                                                </p>
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="no_rujukan"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Nomor Rujukan</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} value={field?.value || undefined} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={control}
                            name="tgl_rujukan"
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-lg:my-4">
                                        <FormLabel>Tanggal Rujukan</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="block"
                                                type="date"
                                                {...field}
                                                value={field?.value || undefined}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        {data?.id_asuransi === 1 && (
                            <div className="xl:grid-cols-2">
                                <button
                                    className="p-0 text-red-600 text-sm underline"
                                    type="button"
                                    onClick={() => setIsReferenceDialog(true)}
                                >
                                    Pilih Rujukan
                                </button>
                                <SelectReference
                                    openSelectDialog={isSelectReferenceDialog}
                                    setSelectDialog={setIsReferenceDialog}
                                    onSelectReference={onSelectReference}
                                    BPJSNumber={data?.nomor_asuransi}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4 mt-8 col-span-2">
                            <FormField
                                control={control}
                                name="nama_wali"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nama Wali*</FormLabel>
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
                                name="id_hub_wali"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Hubungan Keluarga (wali)*</FormLabel>
                                            <FormControl>
                                                <SelectSearch<FamilyStatus>
                                                    url="/master/family-status"
                                                    labelName="nama_status_keluarga"
                                                    valueName="id"
                                                    placeholder="Pilih ..."
                                                    onChange={field.onChange}
                                                    defaultValue={field.value || undefined}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="telp_wali"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Telepon Wali*</FormLabel>
                                            <FormControl>
                                                <Input type="tel" {...field} value={field?.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4 mt-6 col-span-2">
                            <FormField
                                control={control}
                                name="asal_rujukan"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nama Perujuk (RS/Puskesmas/dll)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" value={field?.value || undefined} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="nama_perujuk"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Nama Dokter/Bidan/dll</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" value={field?.value || undefined} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="ket_rujukan"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Keterangan</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} value={field?.value?.toString() || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <FormError errors={patchError} />
                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={patchLoading}>
                            {patchLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Loading</span>
                                </>
                            ) : (
                                <span>Simpan</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Registration;
