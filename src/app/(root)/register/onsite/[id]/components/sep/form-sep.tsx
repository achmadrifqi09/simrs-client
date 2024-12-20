import {Form} from '@/components/ui/form';
import {useForm} from 'react-hook-form';
import {SEPValidationSchema} from '@/validation-schema/sep';
import {zodResolver} from '@hookform/resolvers/zod';
import {Registration} from '@/types/register';
import {PatientReference} from '@/types/patient-reference';
import {toast} from '@/hooks/use-toast';
import {PatientType} from '@/types/patient';
import {SetStateAction, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Loader2, Send} from 'lucide-react';
import {Area} from '@/types/bpjs-area-reference';
import {Button} from '@/components/ui/button';
import {extractPorvinceIdInUrl, extractRegencyIdInUrl} from './helpers/extractor';
import {FormSEP as FormSEPType} from './helpers/infer';
import useGet from '@/hooks/use-get';
import GeneralSEPForm from './forms/general-sep-form';
import CareClassSEPForm from './forms/care-class-sep-form';
import PolyclinicSEPForm from './forms/polyclinic-sep-form';
import ReferenceSEPForm from './forms/reference-sep-form';
import GuarantorSEPForm from './forms/guarantor-sep-form';
import {buildDefaultValue} from '@/const/sep-default-value';
import SKDPFormSEP from './forms/skdp-sep';
import {usePost} from '@/hooks/use-post';
import FormError from '@/components/ui/form-error';

interface FormSEPProps {
    setOpenSEPDialog: React.Dispatch<SetStateAction<boolean>>;
    patient: PatientType | null;
    registration: Registration | null;
    onRefresh: () => void;
}

enum FetchEvent {
    REGENCY = 'REGENCY_FETCH',
    SUBDISTRICT = 'SUBDISTRICT_FETCH',
}

const FormSEP = ({registration, patient, setOpenSEPDialog, onRefresh}: FormSEPProps) => {
    const PPK_LAYANAN = process.env.NEXT_PUBLIC_BPJS_FASKES_CODE || '';
    const formSEP = useForm<FormSEPType>({
        resolver: zodResolver(SEPValidationSchema),
        defaultValues: buildDefaultValue(PPK_LAYANAN),
    });
    const [areaFetchEvent, setAreaFetchEvent] = useState<FetchEvent | null>(null);
    const [regencyUrl, setRegencyUrl] = useState<string>('');
    const [subDistrict, setSubDistrict] = useState<string>('');
    const {data: patientReference, error} = useGet<PatientReference>({
        url: `/bpjs/v-claim/participant/reference/${registration?.no_rujukan}`,
    });
    const {data: provinces, error: provincesError} = useGet<Area[]>({
        url: `/bpjs/v-claim/reference/province`,
    });
    const {
        data: regencies,
        error: regencyError,
        getData: fetchRegency,
    } = useGet<Area[]>({url: regencyUrl, firstLoad: false});
    const {
        data: subDistricts,
        error: subDistrictError,
        getData: fetchSubDistrict,
    } = useGet<Area[]>({url: subDistrict, firstLoad: false});
    const {postData, postLoading, postError} = usePost(`/bpjs/v-claim/SEP`);
    const {control, handleSubmit, setValue} = formSEP;
    const {data: session} = useSession();

    const fillInput = () => {
        formSEP.reset({
            noKartu: patient?.no_bpjs,
            jnsPelayanan: '2',
            klsRawatHak: patientReference?.rujukan.peserta?.hakKelas?.kode || '',
            noMR: patient?.kode_rm || '',
            asalRujukan: patientReference?.asalFaskes,
            tglRujukan: patientReference?.rujukan?.tglKunjungan,
            noRujukan: registration?.no_rujukan || '',
            noTelp: patient?.no_hp,
            ppkRujukan: patientReference?.rujukan.provPerujuk.kode || '',
            user: session?.user?.name,
            tujuan: registration?.antrian?.jadwal_dokter?.unit?.kode_instalasi_bpjs || '',
            dpjpLayan: registration?.antrian?.jadwal_dokter?.pegawai?.kode_dpjp || '',
        });
    };

    const onSubmit = handleSubmit(async (values) => {
        const response = await postData(values);
        if (response) {
            onRefresh();
            setOpenSEPDialog(false);
            toast({
                title: 'Berhasil',
                description: 'Insert SEP berhasil dilakuan',
            });
        }
    });

    useEffect(() => {
        if (patient && registration && patientReference) {
            fillInput();
        }
        if (error) {
            toast({
                title: 'Terjadi Kesalahan',
                description: error.toString(),
            });
        }
    }, [error, patientReference]);

    useEffect(() => {
        const provinceIdInUrl = extractPorvinceIdInUrl(regencyUrl);
        const provinceId = formSEP.getValues('kdPropinsi');
        if (provinceId && provinceId !== provinceIdInUrl) {
            setAreaFetchEvent(FetchEvent.REGENCY);
            setRegencyUrl(`/bpjs/v-claim/reference/province/${formSEP.getValues('kdPropinsi')}/regency`);
        }

        const regencyIdInUrl = extractRegencyIdInUrl(subDistrict);
        const regencyId = formSEP.getValues('kdKabupaten');
        if (regencyId && regencyId !== regencyIdInUrl) {
            setAreaFetchEvent(FetchEvent.SUBDISTRICT);
            setSubDistrict(
                `/bpjs/v-claim/reference/province/${formSEP.getValues('kdPropinsi')}/regency/${formSEP.getValues(
                    'kdKabupaten'
                )}/subdistrict`
            );
        }
    }, [formSEP.watch('kdPropinsi'), formSEP.watch('kdKabupaten')]);

    useEffect(() => {
        if ((regencyUrl !== '' || regencyUrl) && areaFetchEvent === FetchEvent.REGENCY) {
            fetchRegency().then(() => {
                setAreaFetchEvent(null);
            });
        }

        if ((subDistrict !== '' || subDistrict) && areaFetchEvent === FetchEvent.SUBDISTRICT) {
            fetchSubDistrict().then(() => {
                setAreaFetchEvent(null);
            });
        }
    }, [areaFetchEvent]);

    useEffect(() => {
        if (subDistrictError || provincesError || regencyError) {
            toast({
                title: 'Terjadi kesalahan',
                description: subDistrictError?.toString() || provincesError?.toString() || regencyError?.toString(),
            })
        }
    }, [subDistrictError, provincesError, regencyError]);

    return (
        <form className="pb-8 px-2" onSubmit={onSubmit}>
            <Form {...formSEP}>
                <GeneralSEPForm control={control} setValue={setValue}/>
                <CareClassSEPForm control={control}/>
                <PolyclinicSEPForm control={control}/>
                <ReferenceSEPForm control={control}/>
                <SKDPFormSEP control={control}/>
                <GuarantorSEPForm
                    control={control}
                    provinces={provinces}
                    regencies={regencies}
                    subdistrics={subDistricts}
                />
                <FormError errors={postError}/>
                <div className="flex justify-end">
                    <Button className="min-w-[140px]" disabled={postLoading}>
                        {postLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                                <span>Loading..</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2"/>
                                <span>Kirim</span>
                            </>
                        )}
                    </Button>
                </div>
            </Form>
        </form>
    );
};

export default FormSEP;
