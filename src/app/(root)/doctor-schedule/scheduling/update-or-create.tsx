"use client"
import {Button} from "@/components/ui/button"
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,} from "@/components/ui/drawer"
import {Calendar as CalendarIcon, Loader2, XIcon} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {doctorScheduleValidation} from "@/validation-schema/doctor-schedule";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {formatISODayToNormalDay} from "@/lib/formatter/date-formatter";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import SelectSearch from "@/components/ui/select-search";
import {QueueUnit} from "@/types/outpatient";
import {usePost} from "@/hooks/use-post";
import {DoctorSchedule, DoctorSchedulePayload} from "@/types/doctor-schedule";
import {Action} from "@/enums/action";
import {usePatch} from "@/hooks/use-patch";
import {toast} from "@/hooks/use-toast";
import FormError from "@/components/ui/form-error";
import {timeStringFormatter} from "@/utils/date-formatter";
import {Employee} from "@/types/employee";

type UpdateOrCreateDoctorScheduleProps = {
    onRefresh: () => void;
    selectedRecord: DoctorSchedule | null;
    setSelectedRecord: React.Dispatch<React.SetStateAction<DoctorSchedule | null>>;
    actionType: Action;
    openDrawer: boolean
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateOrCreateDoctorSchedule = ({
                                          onRefresh,
                                          selectedRecord,
                                          setSelectedRecord,
                                          actionType,
                                          openDrawer,
                                          setOpenDrawer
                                      }: UpdateOrCreateDoctorScheduleProps) => {
    const [scheduleType, setScheduleType] = useState<1 | 2>(1)
    const [practiceDate, setPracticeDate] = useState<Date | undefined>(undefined)
    const scheduleForm = useForm<z.infer<typeof doctorScheduleValidation>>({
        resolver: zodResolver(doctorScheduleValidation),
        defaultValues: {
            id_pegawai: 0,
            kode_instalasi_bpjs: '',
            hari_praktek: '1',
            kuota_mjkn: '0',
            kuota_online_umum: '0',
            kuota_onsite: '0',
            jam_buka_praktek: '08:00:00',
            jam_tutup_praktek: '10:00:00',
        }
    })
    const {handleSubmit, control, setValue} = scheduleForm;
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [submitMode, setSubmitMode] = useState<'POST' | 'PATCH'>('POST');
    const [selectedRecordId, setSelectedRecordId] = useState<number | null | undefined>(null);
    const {postData, postLoading, postError} = usePost('/doctor-schedule');
    const {updateData, patchError, patchLoading} = usePatch();
    const handleCloseDrawer = () => {
        setValue('kode_instalasi_bpjs', '')
        setValue('hari_praktek', '')
        setValue('kuota_mjkn', '')
        setValue('kuota_online_umum', '')
        setValue('kuota_onsite', '')
        setValue('jam_buka_praktek', '0')
        setValue('jam_tutup_praktek', '0')
        setDrawerOpen(!drawerOpen);
        setSelectedRecord(null)
        setOpenDrawer(false);
    }
    const onUpdateDoctorSchedule = (scheduleForm: DoctorSchedule) => {
        setSubmitMode('PATCH')
        setDrawerOpen(true);
        setSelectedRecordId(scheduleForm.id_jadwal_dokter)
        setValue('id_pegawai', Number(scheduleForm.id_pegawai))
        setValue('kode_instalasi_bpjs', scheduleForm.kode_instalasi_bpjs)
        setValue('hari_praktek', scheduleForm.hari_praktek.toString())
        setValue('kuota_mjkn', scheduleForm.kuota_mjkn.toString())
        setValue('kuota_online_umum', scheduleForm.kuota_online_umum.toString())
        setValue('kuota_onsite', scheduleForm.kuota_onsite.toString())
        setValue('jam_buka_praktek', timeStringFormatter(scheduleForm.jam_buka_praktek))
        setValue('jam_tutup_praktek', timeStringFormatter(scheduleForm.jam_tutup_praktek))
    }

    const onSubmit = handleSubmit(async (values) => {
        const payload: DoctorSchedulePayload = {
            ...values,
            id_pegawai: Number(values.id_pegawai),
            hari_praktek: Number(values.hari_praktek),
            kuota_mjkn: Number(values.kuota_mjkn),
            kuota_online_umum: Number(values.kuota_online_umum),
            kuota_onsite: Number(values.kuota_onsite),
            jenis_jadwal: scheduleType
        }
        if (scheduleType === 2) {
            if (practiceDate) {
                delete payload.hari_praktek;
                payload.tgl_praktek = format(practiceDate, "dd-MM-yyyy")
            } else {
                toast({
                    title: "Terjadi kesalahan",
                    description: 'Tanggal praktek tidak valid',
                })
                return;
            }
        }

        const response = submitMode === 'POST' ? (
            await postData(payload)
        ) : (
            await updateData(
                `/doctor-schedule/${selectedRecordId}`,
                payload
            )
        )
        if (response?.data) {
            setOpenDrawer(false)
            toast({
                title: "Aksi Berhasil",
                description: `Berhasil ${submitMode === 'POST' ? 'menambah data'
                    : 'memperbarui data '}`,
            })
            scheduleForm.reset();
            onRefresh();
        }
    })
    useEffect(() => {
        if (selectedRecord) {
            if (actionType === Action.UPDATE_FIELDS) onUpdateDoctorSchedule(selectedRecord);
        }
    }, [selectedRecord])
    return (
        <>
            <Drawer open={openDrawer} onOpenChange={handleCloseDrawer}>
                <DrawerContent>
                    <div
                        className="max-w-screen-xl xl:max-w-screen-2xl mx-auto w-full text-xl px-6 h-[88dvh] md:h-auto">
                        <DrawerHeader className="pt-2 mb-0 pb-0">
                            <DrawerTitle>
                                <div className="flex justify-between items-center">
                                    {submitMode === 'POST' ? 'Tambah' : 'Update'} Jadwal Dokter
                                    <Button variant="ghost" size="icon" className="text-gray-600"
                                            onClick={() => {
                                                setOpenDrawer(false)
                                                setSubmitMode('POST')
                                            }}>
                                        <XIcon/>
                                    </Button>
                                </div>
                            </DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                        </DrawerHeader>
                        <div className="font-normal text-base px-4 py-6 h-[80dvh] md:h-auto overflow-y-auto">
                            <Form {...scheduleForm}>
                                <form onSubmit={onSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                        <div>
                                            <Label className="block mb-[16px]">Pilih jenis jadwal*</Label>
                                            <Select
                                                onValueChange={(value) => setScheduleType(value === '1' ? 1 : 2)}
                                                defaultValue={scheduleType.toString()}>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder="Pilih jenis jadwal"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">
                                                            Jadwal perhari
                                                        </SelectItem>
                                                        <SelectItem value="2">
                                                            Jadwal pertanggal
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormField
                                            control={control}
                                            name="kode_instalasi_bpjs"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Unit instalasi / poliklinik*</FormLabel>
                                                        <FormControl>
                                                            <SelectSearch<QueueUnit>
                                                                url="/work-unit/queue-unit"
                                                                labelName="nama_unit_kerja"
                                                                valueName="kode_instalasi_bpjs"
                                                                placeholder="Masukkan nama / kode ..."
                                                                onChange={field.onChange}
                                                                defaultValue={field.value}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        <FormField
                                            control={control}
                                            name="id_pegawai"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Pilih Dokter*</FormLabel>
                                                        <FormControl>
                                                            <SelectSearch<Employee>
                                                                url="/employee/doctor"
                                                                labelName="nama_pegawai"
                                                                valueName="id_pegawai"
                                                                placeholder="Masukkan nama Dokter..."
                                                                onChange={field.onChange}
                                                                defaultValue={field.value > 0 ? field.value : undefined}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        {
                                            scheduleType === 1 ? (
                                                <FormField
                                                    control={control}
                                                    name="hari_praktek"
                                                    render={({field}) => {
                                                        return (
                                                            <FormItem>
                                                                <FormLabel>Hari Praktek*</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        defaultValue={field?.value ? field?.value.toString() : '1'}>
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder="Pilih hari praktek"/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                {
                                                                                    Array.from({length: 7}, (_, index) => (
                                                                                        <SelectItem
                                                                                            value={`${index + 1}`}
                                                                                            key={index}>
                                                                                            {formatISODayToNormalDay(index + 1)}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )
                                                    }}/>

                                            ) : (
                                                <div>
                                                    <Label className="block mb-[16px]">Tanggal Praktek*</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-between text-left font-normal gap-4 items-center border-gray-muted text-gray-900 text-sm hover:bg-white hover:text-gray-900"
                                                                )}
                                                            >
                                                                {practiceDate ? format(practiceDate, 'dd-MM-yyyy') :
                                                                    <span className="block">Pilih tanggal</span>}
                                                                <CalendarIcon className="w-5 h-5 text-gray-700"/>
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="end">
                                                            <Calendar
                                                                mode="single"
                                                                selected={practiceDate}
                                                                onSelect={(value) => setPracticeDate(value)}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            )
                                        }
                                        <FormField
                                            control={control}
                                            name="jam_buka_praktek"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Jam buka praktek*</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" step={2} {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        <FormField
                                            control={control}
                                            name="jam_tutup_praktek"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Jam tutup praktek*</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" step={2} {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        <FormField
                                            control={control}
                                            name="kuota_mjkn"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Kuota MJKN*</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        <FormField
                                            control={control}
                                            name="kuota_online_umum"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Kuota online umum*</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                        <FormField
                                            control={control}
                                            name="kuota_onsite"
                                            render={({field}) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Kuota onsite*</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )
                                            }}/>
                                    </div>
                                    <FormError
                                        errors={postError || patchError}
                                    />
                                    <div className="flex justify-end mt-6">
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
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default UpdateOrCreateDoctorSchedule
