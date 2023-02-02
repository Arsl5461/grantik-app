import { useMutation } from 'react-query';

import { axios } from '../../../lib/axios';
import { MutationConfig, queryClient } from '../../../lib/react-query';
import { useNotificationStore } from '../../../stores/notifications';

import { Product } from '../types';

export type UpdateProductDTO = {
  data: {
    name: string;
    image: string;
    gltf: string;
    amount: number;
    type: string;
    description: string;
    detail: string;
    price: number
  };
  productId: string;
};

export const updateProduct = ({
  data,
  productId,
}: UpdateProductDTO): Promise<Product> => {
  return axios.patch(`/products/${productId}`, data);
};

type UseUpdateProductOptions = {
  config?: MutationConfig<typeof updateProduct>;
};

export const useUpdateProduct = ({ config }: UseUpdateProductOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (updatingProduct: any) => {
      await queryClient.cancelQueries(['product', updatingProduct?.productId]);

      const previousProduct = queryClient.getQueryData<Product>([
        'product',
        updatingProduct?.productId,
      ]);

      queryClient.setQueryData(['product', updatingProduct?.productId], {
        ...previousProduct,
        ...updatingProduct.data,
        id: updatingProduct.ProductId,
      });

      return { previousProduct };
    },
    onError: (_, __, context: any) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(
          ['product', context.previousProduct.id],
          context.previousProduct
        );
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['product', data._id]);
      addNotification({
        type: 'success',
        title: 'Vöru bætt við',
      });
    },
    ...config,
    mutationFn: updateProduct,
  });
};
