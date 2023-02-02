import { Table, Spinner, Link } from "../../../components/Elements";
import { formatDate } from "../../../utils/format";

import { useOrders } from "../api/getOrders";
import { DeleteOrder } from './DeleteOrder';
import { Order } from "../types";

export const OrdersList = () => {
  const ordersQuery = useOrders();
  console.log(ordersQuery.data);

  if (ordersQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!ordersQuery.data) return null;

  return (
    <Table<Order>
      data={ordersQuery.data}
      columns={[
        {
          title: "Order Id",
          field: "orderId",
        },
        {
          title: "Total Price (ISK)",
          field: "amount",
        },
        {
          title: "Buyer Email",
          field: "email",
        },
        {
          title: "Payment Method",
          field: "paymentType",
        },
        {
          title: "Búið til kl",
          field: "created_at",
          Cell({ entry: { created_at } }) {
            return <span>{formatDate(created_at)}</span>;
          },
        },
        {
          title: "",
          field: "_id",
          Cell({ entry: { _id } }) {
            return <Link to={`./${_id}`}>Skoða</Link>;
          },
        },
        {
          title: "",
          field: "_id",
          Cell({ entry: { _id } }) {
            return <DeleteOrder id={_id} />;
          },
        },
      ]}
    />
  );
};
