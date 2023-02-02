import { useMutation } from 'react-query';

import { axios } from '../../../lib/axios';
import { MutationConfig, queryClient } from '../../../lib/react-query';
import { useNotificationStore } from '../../../stores/notifications';

import { Product } from '../types';

export type CreateProductDTO = {
  data: {
    name: string;
    type: string;
    image: string;
    gltf: string;
    detail: string;
    description: string;
    price: number;
  };
};

export const createProduct = ({ data }: CreateProductDTO): Promise<Product> => {
  return axios.post(`/products`, data);
};

type UseCreateProductOptions = {
  config?: MutationConfig<typeof createProduct>;
};

export const useCreateProduct = ({ config }: UseCreateProductOptions = {}) => {
  const { addNotification } = useNotificationStore();
  return useMutation({
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries('products');

      const previousProducts = queryClient.getQueryData<Product[]>('products');

      queryClient.setQueryData('products', [...(previousProducts || []), newProduct.data]);

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
        title: 'Vara hefur verið búin til',
      });
    },
    ...config,
    mutationFn: createProduct,
  });
};
