import { Button, ConfirmationDialog } from '../../../components/Elements';
import { useAuth } from '../../../lib/auth';

import { useDeleteUser } from '../api/deleteUser';

type DeleteUserProps = {
  id: string;
};

export const DeleteUser = ({ id }: DeleteUserProps) => {
  const { user } = useAuth();
  const deleteUserMutation = useDeleteUser();

  if (user?.id === id) return null;

  return (
    <ConfirmationDialog
      icon="danger"
      title="Eyða notanda"
      body="Ertu viss um að þú viljir eyða notandanum?"
      triggerButton={<Button variant="danger">Eyða</Button>}
      confirmButton={
        <Button
          isLoading={deleteUserMutation.isLoading}
          type="button"
          className="bg-red-600"
          onClick={() => deleteUserMutation.mutate({ userId: id })}
        >
          Eyða notanda
        </Button>
      }
    />
  );
};
