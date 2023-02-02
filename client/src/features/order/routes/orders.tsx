import { ContentLayout } from '../../../components/Layout';

import { OrdersList } from '../components/OrderList';

export const Orders = () => {
  return (
    <ContentLayout title="order">
      <div className="mt-4">
        <OrdersList />
      </div>
    </ContentLayout>
  );
};
