import { useMutation } from "react-query";

import { axios } from "../../../lib/axios";
import { MutationConfig, queryClient } from "../../../lib/react-query";
import { useNotificationStore } from "../../../stores/notifications";

import { Order } from "../types";

export const deliverOrder = ({ orderId }: { orderId: string }) => {
  return axios.delete(`/orders/${orderId}`);
};

type UseDeleteOrderOptions = {
  config?: MutationConfig<typeof deliverOrder>;
};

export const useDeleteOrder = ({ config }: UseDeleteOrderOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deliveredOrder) => {
      await queryClient.cancelQueries("orders");

      const previousOrders = queryClient.getQueryData<Order[]>("orders");

      queryClient.setQueryData(
        "orders",
        previousOrders?.filter((order) => order._id !== deliveredOrder.orderId)
      );

      return { previousOrders };
    },
    onError: (_, __, context: any) => {
      if (context?.previousOrders) {
        queryClient.setQueryData("orders", context.previousOrders);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      addNotification({
        type: "success",
        title: "Vöru eytt",
      });
    },
    ...config,
    mutationFn: deliverOrder,
  });
};
