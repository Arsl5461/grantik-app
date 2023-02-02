import { TrashIcon } from '@heroicons/react/outline';

import { Button, ConfirmationDialog } from '../../../components/Elements';
import { Authorization, ROLES } from '../../../lib/authorization';

import { useDeleteOrder } from '../api/deleteOrder';

type DeleteOrderProps = {
  id: string;
};

export const DeleteOrder = ({ id }: DeleteOrderProps) => {
  const deleteOrderMutation = useDeleteOrder();

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <ConfirmationDialog
        icon="danger"
        title="Eyða vöru"
        body="Ertu viss um að þú viljir eyða þessari vöru?"
        triggerButton={
          <Button variant="danger" startIcon={<TrashIcon className="h-4 w-4" />}>
            Eyða vöru
          </Button>
        }
        confirmButton={
          <Button
            isLoading={deleteOrderMutation.isLoading}
            type="button"
            className="bg-red-600"
            onClick={async () => await deleteOrderMutation.mutateAsync({ orderId: id })}
          >
            Eyða vöru
          </Button>
        }
      />
    </Authorization>
  );
};
