import React from 'react';
import {ZodError} from "zod";

interface FormErrorProps {
    errors: any;
}

const FormError: React.FC<FormErrorProps> = ({errors}) => {
    return (
        <>
            {errors && Array.isArray(errors) ? (
                <div>
                    {errors.map((error: ZodError, index: number) => (
                        <p className="text-sm text-red-600" key={index}>{error.message}</p>
                    ))}
                </div>
            ) : (
                errors && (
                    {errors}
                )
            )}
        </>
    );
};

export default FormError;
