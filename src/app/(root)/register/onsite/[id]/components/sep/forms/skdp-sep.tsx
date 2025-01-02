import { Control } from 'react-hook-form';
import { FormSEP } from '../helpers/infer';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface SKDPFormProps {
    control: Control<FormSEP>;
}

const SKDPFormSEP = ({ control }: SKDPFormProps) => {
    return (
        <div className="mt-8">
            <p className="text-sm font-medium mb-2 underline text-left">SKDP</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
                <FormField
                    control={control}
                    name="noSurat"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Nomor Surat</FormLabel>
                                <Input {...field} value={field.value || ''} />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={control}
                    name="kodeDPJP"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="text-left block">Kode DPJP</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value || ''} />
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

export default SKDPFormSEP;
