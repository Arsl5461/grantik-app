import { useQuery } from 'react-query';

import { axios } from '../../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../../lib/react-query';

import { Product } from '../types';

export const getProducts = (): Promise<Product[]> => {
  return axios.get('/products');
};

type QueryFnType = typeof getProducts;

type UseProductsOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useProducts = ({ config }: UseProductsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });
};
