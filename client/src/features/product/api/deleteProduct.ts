import { useMutation } from 'react-query';

import { axios } from '../../../lib/axios';
import { MutationConfig, queryClient } from '../../../lib/react-query';
import { useNotificationStore } from '../../../stores/notifications';

import { Product } from '../types';

export const deleteProduct = ({ productId }: { productId: string }) => {
  return axios.delete(`/products/${productId}`);
};

type UseDeleteProductOptions = {
  config?: MutationConfig<typeof deleteProduct>;
};

export const useDeleteProduct = ({ config }: UseDeleteProductOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deletedProduct) => {
      await queryClient.cancelQueries('products');

      const previousProducts = queryClient.getQueryData<Product[]>('products');

      queryClient.setQueryData(
        'products',
        previousProducts?.filter(
          (product) => product._id !== deletedProduct.productId
        )
      );

      return { previousProducts };
    },
    onError: (_, __, context: any) => {
      if (context?.previousProducts) {
        queryClient.setQueryData('products', context.previousProducts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      addNotification({
        type: 'success',
        title: 'Vöru eytt',
      });
    },
    ...config,
    mutationFn: deleteProduct,
  });
};
