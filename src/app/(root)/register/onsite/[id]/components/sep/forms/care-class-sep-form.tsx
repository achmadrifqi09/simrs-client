import { Control } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CareClassSEPFormProps {
    control: Control<FormSEP>;
}

const CareClassSEPForm = ({ control }: CareClassSEPFormProps) => {
    return (
        <div className="mt-8">
            <p className="text-sm font-medium mb-2 underline text-left">Kelas Rawat BPJS</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 items-start">
                <FormField
                    control={control}
                    name="klsRawatHak"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Hak Kelas*</FormLabel>
                                <FormControl>
                                    <Select value={field?.value || ''} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih .." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Kelas 1</SelectItem>
                                            <SelectItem value="2">Kelas 2</SelectItem>
                                            <SelectItem value="3">Kelas 3</SelectItem>
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
                    name="klsRawatNaik"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Naik Kelas Rawat</FormLabel>

                                <FormControl>
                                    <div>
                                        <Select value={field?.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih .." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">VIIP</SelectItem>
                                                <SelectItem value="2">VIP</SelectItem>
                                                <SelectItem value="3">Kelas 1</SelectItem>
                                                <SelectItem value="4">Kelas 2</SelectItem>
                                                <SelectItem value="5">Kelas 3</SelectItem>
                                                <SelectItem value="6">ICCU</SelectItem>
                                                <SelectItem value="7">ICU</SelectItem>
                                                <SelectItem value="8">Di atas kelas 1</SelectItem>
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
                <FormField
                    control={control}
                    name="pembiayaan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Pembiayaan</FormLabel>
                                <FormControl>
                                    <div>
                                        <Select value={field?.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih .." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Pribadi</SelectItem>
                                                <SelectItem value="2">Pemberi kerja</SelectItem>
                                                <SelectItem value="3">Asuransi kesehatan tambahan</SelectItem>
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
                <FormField
                    control={control}
                    name="penanggungJawab"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Penanggung Jawab</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input type="text" {...field} value={field?.value || ''} />
                                        <p className="text-xs text-gray-500 mt-1.5">
                                            Isi jika pasien naik kelas rawat, contoh Pribadi jika pembiayaan
                                            ditanggung pribadi
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

export default CareClassSEPForm;
