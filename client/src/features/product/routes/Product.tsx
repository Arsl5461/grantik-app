import { useParams } from 'react-router-dom';

import { Spinner} from '../../../components/Elements';
import { Head } from '../../../components/Head';
import { ContentLayout } from '../../../components/Layout';
import { formatDate } from '../../../utils/format';

import { useProduct } from '../api/getProduct';
import { UpdateProduct } from '../components/UpdateProduct';

export const Product = () => {
  const { productId } = useParams();
  const productQuery = useProduct({ productId });

  if (productQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!productQuery.data) return null;

  return (
    <>
      <Head title={productQuery.data.name} />
      <ContentLayout title={productQuery.data.name}>
        <span className="text-xs font-bold">{formatDate(productQuery.data.created_at)}</span>
        <div className="mt-6 flex flex-col space-y-16">
          <div className="flex justify-end">
            <UpdateProduct productId={productId} />
          </div>
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="mt-1 text-sm text-gray-500 grid sm:grid-cols-1 md:grid-cols-2">
                  <div className="p-3">
                    <img src={productQuery.data.imageUrl} alt={productQuery.data.name} />
                  </div>
                  <div className="p-3">
                    <h2 className="text-md title-font text-gray-500 tracking-widest">Tegund:</h2>
                    <h1 className="text-gray-900 text-2xl title-font font-medium mb-1">{productQuery.data.type}</h1>
                    <h2 className="text-md title-font text-gray-500 tracking-widest">Verð:</h2>
                    <h1 className="text-gray-900 text-2xl title-font font-medium mb-1">{productQuery.data.price} Kr</h1>
                    <h2 className="text-md title-font text-gray-500 tracking-widest">Upplýsingar:</h2>
                    <h1 className="text-gray-900 text-2xl title-font font-medium mb-1">{productQuery.data.detail}</h1>
                    <h2 className="text-md title-font text-gray-500 tracking-widest">Lýsing:</h2>
                    <h1 className="text-gray-900 text-2xl title-font font-medium mb-1">{productQuery.data.description}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
