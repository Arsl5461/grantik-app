import { ContentLayout } from "../../../components/Layout";

import { CreateProduct } from '../components/CreateProduct';
import { ProductsList } from '../components/ProductsList';

export const Products = () => {
  return (
    <ContentLayout title="Vörulisti">
      <div className="flex justify-end">
          <CreateProduct />
      </div>
      <div className="mt-4">
          <ProductsList />
      </div>
    </ContentLayout>
  )
}