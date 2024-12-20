import { Control } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SelectSearch from '@/components/ui/select-search';
import { QueueUnit } from '@/types/outpatient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PolyclinicSEPFormProps {
    control: Control<FormSEP>;
}

const PolyclinicSEPForm = ({ control }: PolyclinicSEPFormProps) => {
    return (
        <div className="mt-8">
            <p className="text-sm font-medium mb-2 underline text-left">Poliklinik</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
                <FormField
                    control={control}
                    name="tujuan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Poliklinik Tujuan*</FormLabel>
                                <SelectSearch<QueueUnit>
                                    url="/work-unit/queue-unit"
                                    labelName="nama_unit_kerja"
                                    valueName="kode_instalasi_bpjs"
                                    placeholder="Pilih .."
                                    onChange={field.onChange}
                                    defaultValue={field.value || ''}
                                />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="eksekutif"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Poliklinik Eksekutif*</FormLabel>
                                <FormControl>
                                    <div>
                                        <Select
                                            value={field?.value || '0'}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih .." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Tidak</SelectItem>
                                                <SelectItem value="1">Ya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs mt-1.5 text-gray-500">Isi jika pasien naik kelas rawat</p>
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

export default PolyclinicSEPForm;
