import { useQuery } from 'react-query';

import { axios } from '../../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../../lib/react-query';

import { Order } from '../types';

export const getOrder = ({ orderId }: { orderId: string }): Promise<Order> => {
  return axios.get(`/orders/${orderId}`);
};

type QueryFnType = typeof getOrder;

type UseOrderOptions = {
  orderId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useOrder = ({ orderId, config }: UseOrderOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['orders', orderId],
    queryFn: () => getOrder({ orderId }),
  });
};
