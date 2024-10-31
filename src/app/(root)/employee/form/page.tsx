"use client"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Section from "@/components/ui/section";
import {Button} from "@/components/ui/button";
import {CalendarDays, Loader2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {usePost} from "@/hooks/use-post";
import {usePatch} from "@/hooks/use-patch";
import {Action} from "@/enums/action";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {employeeValidation} from "@/validation-schema/employee"
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {EmployeeDTO} from "@/types/employee";
import SelectSearch from "@/components/ui/select-search";
import {Input} from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import {
    BloodTypeDTO,
    CountryDTO,
    DistrictDTO,
    DoctorSpecialistDTO,
    EducationDTO,
    EmployeeStatusDTO,
    MaritalStatusDTO,
    ProvinceDTO,
    RankOrClassDTO,
    RegencyDTO,
    ReligionDTO,
    StructuralPositionDTO
} from "@/types/master";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {WorkUnit} from "@/types/work-unit";

type UpdateOrCreateEmployeeProps = {
    onRefresh: () => void,
    selectedRecord: EmployeeDTO | null,
    setSelectedRecord: React.Dispatch<React.SetStateAction<EmployeeDTO | null>>
    actionType: Action,
}

const FormEmployee = ({
                          onRefresh,
                          selectedRecord,
                          setSelectedRecord,
                          actionType
                      }: UpdateOrCreateEmployeeProps) => {
    const employeeForm = useForm<z.infer<typeof employeeValidation>>({
        resolver: zodResolver(employeeValidation),
        defaultValues: {
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
            tgl_lahir: new Date("1900-01-01"),
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
            tgl_masuk: new Date("1900-01-01"),
            tgl_keluar: new Date("1900-01-01"),
            status_pns: 0,
            status_aktif: 1,
            id_pelamar: 0,
        }
    })
    const {data: session} = useSession();
    const {postData, postLoading, postError, setPostError} = usePost('/master/employee')
    const {updateData, patchError, patchLoading, setPatchError} = usePatch()
    const {handleSubmit, control, setValue} = employeeForm
    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);
    const [date, setDate] = useState<Date>();

    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');

    const defaultEmployeeValues = {
        id_pegawai: 0,
        no_reg: "",
        nip_pegawai: "",
        nip_pns: "",
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
        tgl_lahir: new Date("1900-01-01"),
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
        tgl_masuk: new Date("1900-01-01"),
        tgl_keluar: new Date("1900-01-01"),
        status_pns: 0,
        status_aktif: 1,
        id_pelamar: 0,
    };

    const setDefaultValues = () => {
        Object.entries(defaultEmployeeValues).forEach(([key, value]) => {
            setValue(`employeeForm.${key}` as keyof EmployeeDTO, value);
        });
    };


    const onSubmit = handleSubmit(async (values) => {
        if (!session?.accessToken) {
            return;
        }

        const transformedValues = {
            ...values,
            tgl_lahir: values.tgl_lahir.toISOString(),
            tgl_masuk: values.tgl_masuk.toISOString(),
            tgl_keluar: values.tgl_keluar.toISOString()
        };

        const employeeData = {
            ...transformedValues,
            id_pegawai: Number(transformedValues.id_pegawai),
            id_ms_negara_asal: Number(transformedValues.id_ms_negara_asal),
            id_ms_provinsi_asal: Number(transformedValues.id_ms_provinsi_asal),
            id_ms_kota_asal: Number(transformedValues.id_ms_kota_asal),
            id_ms_kecamatan_asal: Number(transformedValues.id_ms_kecamatan_asal),
            id_ms_desa_asal: Number(transformedValues.id_ms_desa_asal),
            id_ms_negara_tinggal: Number(transformedValues.id_ms_negara_tinggal),
            id_ms_provinsi_tinggal: Number(transformedValues.id_ms_provinsi_tinggal),
            id_ms_kota_tinggal: Number(transformedValues.id_ms_kota_tinggal),
            id_ms_kecamatan_tinggal: Number(transformedValues.id_ms_kecamatan_tinggal),
            id_ms_desa_tinggal: Number(transformedValues.id_ms_desa_tinggal),
            id_jenis_kelamin: Number(transformedValues.id_jenis_kelamin),
            id_ms_golongan_darah: Number(transformedValues.id_ms_golongan_darah),
            id_ms_status_kawin: Number(transformedValues.id_ms_status_kawin),
            id_ms_agama: Number(transformedValues.id_ms_agama),
            id_ms_pendidikan: Number(transformedValues.id_ms_pendidikan),
            id_ms_jenis_pegawai: Number(transformedValues.id_ms_jenis_pegawai),
            id_ms_status_pegawai: Number(transformedValues.id_ms_status_pegawai),
            id_ms_spesialis: Number(transformedValues.id_ms_spesialis),
            id_unit_induk: Number(transformedValues.id_unit_induk),
            id_pangkat: Number(transformedValues.id_pangkat),
            id_jabatan: Number(transformedValues.id_jabatan),
            id_unit_jabatan: Number(transformedValues.id_unit_jabatan),
            id_gaji: Number(transformedValues.id_gaji),
            pjs: Number(transformedValues.pjs),
            id_finger: Number(transformedValues.id_finger),
            status_pns: Number(transformedValues.status_pns),
            status_aktif: Number(transformedValues.status_aktif),
            id_pelamar: Number(transformedValues.id_pelamar),
        };

        try {
            const response = submitMode === 'POST'
                ? await postData(employeeData)
                : await updateData(`/master/employee/${selectedRecordId}`, employeeData);

            if (response?.status_code === 200) {
                toast({
                    title: "Berhasil",
                    description: `Data pegawai berhasil ${submitMode === 'POST' ? 'ditambahkan' : 'diperbarui'}`,
                });
                onRefresh();
                if (submitMode === 'POST') {
                    employeeForm.reset();
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Terjadi kesalahan saat menyimpan data",
                variant: "destructive"
            });
            console.error("Error submitting employee data:", error);
        }
    });

    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) {
                setSubmitMode('PATCH')
                setSelectedRecordId(selectedRecord.id_pegawai)
                setSelectedRecord(null)
                setDefaultValues()
            }
        }
    }, [selectedRecord, actionType])

    useEffect(() => {
        setPostError(null)
        setPatchError(null)
        employeeForm.clearErrors() // Changed from roomForm to employeeForm
    }, [])

    return (
        <div className="w-full">
            <Section>
                <div className="w-full flex-wrap">
                    <Form {...employeeForm}>
                        <form onSubmit={onSubmit}>
                            {/*<div className="my-4">*/}
                            {/*    <FormField*/}
                            {/*        control={control}*/}
                            {/*        name="nip_pegawai"*/}
                            {/*        render={({field}) => {*/}
                            {/*            return (*/}
                            {/*                <FormItem>*/}
                            {/*                    <FormLabel>NIP Pegawai</FormLabel>*/}
                            {/*                    <FormControl>*/}
                            {/*                        <Input type="number" {...field}/>*/}
                            {/*                    </FormControl>*/}
                            {/*                    <FormMessage/>*/}
                            {/*                </FormItem>*/}
                            {/*            )*/}
                            {/*        }}/>*/}
                            {/*</div>*/}
                            <Section>
                                <div className="flex w-full space-x-4 px-4">
                                    <div className="w-1/2 my-4">
                                        <FormField
                                            control={control}
                                            name="nama_pegawai"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Nama Pegawai</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                    </div>
                                    <div className="w-1/2 my-4">
                                        <FormField
                                            control={control}
                                            name="nip_pns"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>NIP PNS</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex w-full space-x-4 px-4">
                                    <div className="w-1/2 my-4">
                                        <FormField
                                            control={control}
                                            name="gelar_belakang"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Gelar Belakang</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                    </div>
                                    <div className="w-1/2 my-4">
                                        <FormField
                                            control={control}
                                            name="gelar_depan"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Gelar Depan</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Section>
                            <div className="flex w-full space-x-4 px-4">
                                <div className="w-full my-4">
                                    <FormField
                                        control={control}
                                        name="id_ms_negara_asal"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Negara Asal</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<CountryDTO>
                                                            url="/master/country?status=1"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan Negara untuk mencari..."
                                                            onChange={field.onChange}
                                                            defaultValue={Number(field.value) || undefined}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                                <div className="w-full my-4">
                                    <FormField
                                        control={control}
                                        name="id_ms_provinsi_asal"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Pilih Provinsi Asal</FormLabel>
                                                    <FormControl>
                                                        <SelectSearch<ProvinceDTO>
                                                            url="/master/province?status=1"
                                                            labelName="nama"
                                                            valueName="id"
                                                            placeholder="Masukkan Provinsi untuk mencari..."
                                                            onChange={field.onChange}
                                                            defaultValue={Number(field.value) || undefined}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )
                                        }}/>
                                </div>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_kota_asal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kota Asal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<RegencyDTO>
                                                        url="/master/regency?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan kota untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_kecamatan_asal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kecamatan Asal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<DistrictDTO>
                                                        url="/master/regency?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan kecamatan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_desa_asal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kelurahan Asal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<DistrictDTO>
                                                        url="/master/village?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan kelurahan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <h1>Alamat</h1>
                                <Textarea placeholder="Enter your text here..." className="my-custom-class"/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_negara_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Negara Tinggal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<CountryDTO>
                                                        url="/master/country?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan negara untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_provinsi_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Provinsi Tingal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<ProvinceDTO>
                                                        url="/master/province?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan Provinsi untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_kota_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kota Tinggal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<RegencyDTO>
                                                        url="/master/regency?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan Kota untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_kecamatan_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kecamatan Tinggal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<DistrictDTO>
                                                        url="/master/regency?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan Kecamatan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_desa_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Kelurahan Tinggal</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<DistrictDTO>
                                                        url="/master/village?status=1"
                                                        labelName="nama"
                                                        valueName="id"
                                                        placeholder="Masukkan kelurahan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="kode_pos_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Kode Pos Tinggal</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="rt_tinggal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>RT Tinggal</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="rw_asal"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>RW Tinggal</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <h1>Alamat Tinggal</h1>
                                <Textarea placeholder="Enter your text here..." className="my-custom-class"/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="tempat_lahir"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Tempat Lahir</FormLabel>
                                                <FormControl>
                                                    <Input type="text" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4 flex flex-col flex-wrap">
                                <Label htmlFor="select">Tanggal Lahir</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-between text-left font-normal border-input",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            <CalendarDays className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="my-4">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jenis Kelamin"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Laki - laki</SelectItem>
                                            <SelectItem value="2">Perempuan</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_golongan_darah"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Golongan Darah</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<BloodTypeDTO>
                                                        url="/master/blood-type?status=1"
                                                        labelName="nama_golongan_darah"
                                                        valueName="id_ms_golongan_darah"
                                                        placeholder="Masukkan golongan..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_status_kawin"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Status Kawin</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<MaritalStatusDTO>
                                                        url="/master/marital-status?status=1"
                                                        labelName="nama_status_kawin"
                                                        valueName="id_ms_status_kawin"
                                                        placeholder="Masukkan status kawin untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_agama"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Agama</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<ReligionDTO>
                                                        url="/master/regligion?status=1"
                                                        labelName="nama_agama"
                                                        valueName="id_ms_agama"
                                                        placeholder="Masukkan agama untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_pendidikan"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Tingkat Pendidikan</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<EducationDTO>
                                                        url="/master/marital-status?status=1"
                                                        labelName="nama_tingkat_pendidikan"
                                                        valueName="id_ms_tingkat_pendidikan"
                                                        placeholder="Masukkan Pendidikan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_pendidikan"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Status Pegawai</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<EmployeeStatusDTO>
                                                        url="/master/employee-status?status=1"
                                                        labelName="nama_status_pegawai"
                                                        valueName="id_ms_status_pegawai"
                                                        placeholder="Masukkan Status Pegawai untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_ms_spesialis"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Spesialis</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<DoctorSpecialistDTO>
                                                        url="/master/doktor-specialist?status=1"
                                                        labelName="nama_spesialis"
                                                        valueName="id_ms_spesialis"
                                                        placeholder="Masukkan Spesialis untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_unit_induk"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Unit Induk</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<WorkUnit>
                                                        url="/master/doktor-specialist?status=1"
                                                        labelName="nama_unit_kerja"
                                                        valueName="id_unit_induk"
                                                        placeholder="Masukkan Unit untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_pangkat"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Pangkat</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<RankOrClassDTO>
                                                        url="/master/rank-or-class?status=1"
                                                        labelName="nama_pangkat"
                                                        valueName="id_ms_pangkat"
                                                        placeholder="Masukkan Pangkat untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <div className="my-4">
                                <FormField
                                    control={control}
                                    name="id_jabatan"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Pilih Jabatan</FormLabel>
                                                <FormControl>
                                                    <SelectSearch<StructuralPositionDTO>
                                                        url="/master/struktural-position?status=1"
                                                        labelName="nama_jabatan"
                                                        valueName="id_ms_jabatan"
                                                        placeholder="Masukkan Jabatan untuk mencari..."
                                                        onChange={field.onChange}
                                                        defaultValue={Number(field.value) || undefined}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}/>
                            </div>
                            <FormError
                                errors={postError || patchError}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={postLoading}>
                                    {
                                        (postLoading || patchLoading) ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                <span>Loading</span>
                                            </>
                                        ) : (
                                            <span>Simpan</span>
                                        )
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Section>
        </div>
    )
}

export default FormEmployee
