import { useQuery } from 'react-query';

import { axios } from '../../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../../lib/react-query';

import { Product } from '../types';

export const getProduct = ({ productId }: { productId: string }): Promise<Product> => {
  return axios.get(`/products/${productId}`);
};

type QueryFnType = typeof getProduct;

type UseProductOptions = {
  productId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useProduct = ({ productId, config }: UseProductOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['products', productId],
    queryFn: () => getProduct({ productId }),
  });
};
