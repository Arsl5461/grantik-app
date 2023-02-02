import { Navigate, Route, Routes } from 'react-router-dom';

import { Orders } from './orders';
import { Order } from './order';

export const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Orders />} />
      <Route path=":orderId" element={<Order />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
