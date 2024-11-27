import React from 'react';
import {ZodError} from "zod";

interface FormErrorProps {
    errors: any;
}

const FormError: React.FC<FormErrorProps> = ({errors:formError}) => {
    return (
        <>
            {formError && (Array.isArray(formError) || Array.isArray(formError?.errors) ) ? (
               formError.errors ? (
                   formError.errors.map((error: ZodError, index: number) => (
                       <p className="text-sm text-red-600" key={index}>{error.message}</p>
                   ))
               ) : (
                   formError.map((error: ZodError, index: number) => (
                       <p className="text-sm text-red-600" key={index}>{error.message}</p>
                   ))
               )
            ) : (
                formError && (
                    <p className="text-sm text-red-600">{formError.toString()}</p>
                )
            )}
        </>
    );
};

export default FormError;
