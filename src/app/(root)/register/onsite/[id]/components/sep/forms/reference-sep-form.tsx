import { Control } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PolyclinicSEPFormProps {
    control: Control<FormSEP>;
}

const ReferenceSEPForm = ({ control }: PolyclinicSEPFormProps) => {
    return (
        <div className="mt-8">
            <p className="text-sm font-medium mb-2 underline text-left">Rujukan Pasien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
                <FormField
                    control={control}
                    name="asalRujukan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Asal Rujukan*</FormLabel>
                                <Select value={field?.value || ''} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih .." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Faskes 1</SelectItem>
                                        <SelectItem value="2">Faskes 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="tglRujukan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Tanggal Rujukan*</FormLabel>
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
                    name="noRujukan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Nomor Rujukan*</FormLabel>
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
                    name="ppkRujukan"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">PKK Rujukan*</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
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

export default ReferenceSEPForm;
