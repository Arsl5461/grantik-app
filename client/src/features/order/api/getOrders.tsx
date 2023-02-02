import { useQuery } from 'react-query';

import { axios } from '../../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../../lib/react-query';

import { Order } from '../types';

export const getOrders = (): Promise<Order[]> => {
  return axios.get('/orders');
};

type QueryFnType = typeof getOrders;

type UseOrdersOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useOrders = ({ config }: UseOrdersOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['orders'],
    queryFn: () => getOrders(),
  });
};
