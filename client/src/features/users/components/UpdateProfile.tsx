import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, TextAreaField } from '../../../components/Form';
import { useAuth } from '../../../lib/auth';

import { UpdateProfileDTO, useUpdateProfile } from '../api/updateProfile';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  username: z.string().min(1, 'Required'),
  bio: z.string(),
});

export const UpdateProfile = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button startIcon={<PencilIcon className="h-4 w-4" />} size="sm">
          Uppfæra upplýsingar
        </Button>
      }
      title="Uppfæra upplýsingar"
      submitButton={
        <Button
          form="update-profile"
          type="submit"
          size="sm"
          isLoading={updateProfileMutation.isLoading}
        >
          Uppfæra
        </Button>
      }
    >
      <Form<UpdateProfileDTO['data'], typeof schema>
        id="update-profile"
        onSubmit={async (values) => {
          await updateProfileMutation.mutateAsync({ data: values });
        }}
        options={{
          defaultValues: {
            username: user?.username,
            email: user?.email,
            bio: user?.bio,
          },
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Notendanafn"
              error={formState.errors['username']}
              registration={register('username')}
            />
            <InputField
              label="Netfang"
              type="email"
              error={formState.errors['email']}
              registration={register('email')}
            />

            <TextAreaField
              label="Bio"
              error={formState.errors['bio']}
              registration={register('bio')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
