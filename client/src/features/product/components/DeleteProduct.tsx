import { TrashIcon } from '@heroicons/react/outline';

import { Button, ConfirmationDialog } from '../../../components/Elements';
import { Authorization, ROLES } from '../../../lib/authorization';

import { useDeleteProduct } from '../api/deleteProduct';

type DeleteProductProps = {
  id: string;
};

export const DeleteProduct = ({ id }: DeleteProductProps) => {
  const deleteProductMutation = useDeleteProduct();

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
            isLoading={deleteProductMutation.isLoading}
            type="button"
            className="bg-red-600"
            onClick={async () => await deleteProductMutation.mutateAsync({ productId: id })}
          >
            Eyða vöru
          </Button>
        }
      />
    </Authorization>
  );
};
