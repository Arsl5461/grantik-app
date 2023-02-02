import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, InputField } from '../../../components/Form';
import { useAuth } from '../../../lib/auth';

const schema = z.object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
});

type LoginValues = {
    email: string;
    password: string;
};

type LoginFormProps = {
    onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const { login, isLoggingIn } = useAuth();

    return (
        <div>
            <Form<LoginValues, typeof schema>
                onSubmit={async (values) => {
                    await login(values);
                    onSuccess();
                }}
                schema={schema}
            >
                {({ register, formState }) => (
                    <>
                        <InputField
                            type="email"
                            label="Netfang"
                            error={formState.errors['email']}
                            registration={register('email')}
                        />
                        <InputField
                            type="password"
                            label="Lykilorð"
                            error={formState.errors['password']}
                            registration={register('password')}
                        />
                        <div>
                            <Button isLoading={isLoggingIn} type="submit" className="w-full">
                                Skrá inn
                            </Button>
                        </div>
                    </>
                )}
            </Form>
            <div className="mt-2 flex items-center justify-end">
                <div className="text-sm">
                    <Link to="../register" className="font-medium text-blue-600 hover:text-blue-500">
                        Nýskráning
                    </Link>
                </div>
            </div>
        </div>
    );
};
