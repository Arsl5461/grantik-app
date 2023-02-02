import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, InputField } from '../../../components/Form';
import { useAuth } from '../../../lib/auth';

const schema = z
    .object({
        email: z.string().min(1, 'Required'),
        username: z.string().min(1, 'Required'),
        password: z.string().min(1, 'Required'),
    })

type RegisterValues = {
    username: string;
    email: string;
    password: string;
};

type RegisterFormProps = {
    onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const { register, isRegistering } = useAuth();

    return (
        <div>
            <Form<RegisterValues, typeof schema>
                onSubmit={async (values) => {
                    await register(values);
                    onSuccess();
                }}
                schema={schema}
                options={{
                    shouldUnregister: true,
                }}
            >
                {({ register, formState }) => (
                    <>
                        <InputField
                            type="text"
                            label="Notendanafn"
                            error={formState.errors['username']}
                            registration={register('username')}
                        />
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
                            <Button isLoading={isRegistering} type="submit" className="w-full">
                                Nýskrá
                            </Button>
                        </div>
                    </>
                )}
            </Form>
            <div className="mt-2 flex items-center justify-end">
                <div className="text-sm">
                    <Link to="../login" className="font-medium text-blue-600 hover:text-blue-500">
                        Skráðu þig inn
                    </Link>
                </div>
            </div>
        </div>
    );
};
