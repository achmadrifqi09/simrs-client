import { Control } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SelectSearchClient from '@/components/ui/select-search-client';
import { Area } from '@/types/bpjs-area-reference';

interface GuarantroSEPFormProps {
    control: Control<FormSEP>;
    provinces: Area[] | null;
    regencies: Area[] | null;
    subdistrics: Area[] | null;
}

const GuarantorSEPForm = ({ control, provinces, regencies, subdistrics }: GuarantroSEPFormProps) => {
    return (
        <div className="mt-8">
            <p className="text-sm font-medium mb-2 underline text-left">Jaminan</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 items-start">
                <FormField
                    control={control}
                    name="lakaLantas"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Laka lantas*</FormLabel>
                                <Select value={field?.value || '0'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Asal rujukan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Bukan Kecelakaan lalu lintas</SelectItem>
                                        <SelectItem value="1">KLL dan bukan kecelakaan Kerja [BKK]</SelectItem>
                                        <SelectItem value="2">KLL dan KK</SelectItem>
                                        <SelectItem value="3">KK</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="noLP"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">No LP</FormLabel>
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
                    name="tglKejadian"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Tgl Kejadian</FormLabel>
                                <FormControl>
                                    <Input type="date" className="block" {...field} value={field?.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="kdPropinsi"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Kd Provinsi</FormLabel>
                                <FormControl>
                                    <div>
                                        <SelectSearchClient<Area>
                                            options={provinces}
                                            labelName="nama"
                                            valueName="kode"
                                            onChange={field.onChange}
                                            placeholder="Pilih .."
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
                    name="kdKabupaten"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Kd Kabupaten/Kota</FormLabel>
                                <FormControl>
                                    <div>
                                        <SelectSearchClient<Area>
                                            options={regencies}
                                            labelName="nama"
                                            valueName="kode"
                                            onChange={field.onChange}
                                            placeholder="Pilih .."
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
                    name="kdKecamatan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Kd Kecamatan</FormLabel>
                                <FormControl>
                                    <div>
                                        <SelectSearchClient<Area>
                                            options={subdistrics}
                                            labelName="nama"
                                            valueName="kode"
                                            onChange={field.onChange}
                                            placeholder="Pilih .."
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
                    name="keterangan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Keterangan</FormLabel>
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
                    name="suplesi"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Asal Rujukan*</FormLabel>
                                <Select value={field?.value || '0'} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih .." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Tidak</SelectItem>
                                        <SelectItem value="1">Ya</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="noSepSuplesi"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">No SEP Suplesi</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input type="text" {...field} value={field?.value || ''} />
                                        <p className="text-xs mt-1.5 text-gray-500">
                                            No.SEP yang jika terdapat Suplesi
                                        </p>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default GuarantorSEPForm;
