'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {authenticate} from "@/lib/actions/action";
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

const LoginForm = () => {
    const [state, action] = useFormState(authenticate, undefined);
    const { pending } = useFormStatus();
    return (
        <form action={action}>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="m@example.com"
                        type="email"
                    />
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500">{state.errors.email}</p>
                    )}
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link className="text-sm underline" href="#">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" type="password" name="password" />
                    {state?.errors?.password && (
                        <p className="text-sm text-red-500">{state.errors.password}</p>
                    )}
                </div>
                {state?.message && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}
               <Button>
                   {pending ? 'Submitting...' : 'Sign In'}
               </Button>
            </div>
        </form>
    );
}

export default LoginForm