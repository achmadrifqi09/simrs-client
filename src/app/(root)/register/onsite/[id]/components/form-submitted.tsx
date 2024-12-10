import Heading from '@/components/ui/heading';
import { BadgeCheck } from 'lucide-react';
import { ReactNode } from 'react';

const FormSubmitted = ({ children }: { children: ReactNode }) => {
    return (
        <div className="mt-6">
            <Heading headingLevel="h6">Formulir Biaya</Heading>
            <div className="my-6 px-4 py-6 bg-gray-50 flex justify-center items-center rounded-lg gap-2.5">
                <BadgeCheck className="w-6 h-6 text-green-600 animate-pulse" />
                {children}
            </div>
        </div>
    );
};

export default FormSubmitted;
