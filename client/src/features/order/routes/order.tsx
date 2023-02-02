import { useParams } from 'react-router-dom';
import { Table, Spinner, Link } from "../../../components/Elements";
import { Head } from '../../../components/Head';
import { Product } from '../../product';
import { ContentLayout } from '../../../components/Layout';
import { formatDate } from '../../../utils/format';

import { useOrder } from '../api/getOrder';

export const Order = () => {
  const { orderId } = useParams();
  const orderQuery = useOrder({ orderId });

  if (orderQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!orderQuery.data) return null;

  return (
    <>
      <Head title={orderQuery.data.orderId} />
      <ContentLayout title={orderQuery.data.orderId}>
        <span className="text-xs font-bold">{formatDate(orderQuery.data.created_at)}</span>
        <div className="mt-6 flex flex-col space-y-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg grid sm:grid-cols-1 md:grid-cols-2 px-14 py-5">
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Contact Name: <span className='text-black'>{orderQuery.data.contactName}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Contact Surename: <span className='text-black'>{orderQuery.data.contactSurename}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Address: <span className='text-black'>{orderQuery.data.address}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Email: <span className='text-black'>{orderQuery.data.email}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Phone: <span className='text-black'>{orderQuery.data.phone}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Country: <span className='text-black'>{orderQuery.data.country}</span></h2>
            <h2 className="text-md title-font text-gray-500 p-3 tracking-widest">Region Number: <span className='text-black'>{orderQuery.data.regionNumber}</span></h2>
          </div>
          <Table<Product>
            data={orderQuery.data.products}
            columns={[
              {
                title: "Nafn",
                field: "name",
              },
              {
                title: "Mynd",
                field: "imageUrl",
                Cell({ entry: { imageUrl } }) {
                  return <img src={imageUrl} alt="item" width={70} />;
                },
              },
              {
                title: "Tegund",
                field: "type",
              },
              {
                title: "Verð (ISK)",
                field: "price",
              },
              {
                title: "Quanitity",
                field: "created_at",
                Cell({ entry: { order } }) {
                  return <span>&times; {order.quantity}</span>;
                },
              },
              {
                title: "Amount (ISK)",
                field: "created_at",
                Cell({ entry: { order, price } }) {
                  return <span>{order.quantity * price * 1000}</span>;
                },
              },
            ]}
          />
          <div className="flex justify-end"><h2 className="text-md title-font text-gray-500 pr-10 tracking-widest">Total Price: <span className='text-black'>{orderQuery.data.amount} ISK</span></h2></div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg grid sm:grid-cols-1 md:grid-cols-3 px-14 py-10 gap-20">
            <div>
              <img src={orderQuery.data.products[0].order.image} alt="picture" />
              <h2 className="text-md title-font text-gray-500 p-3 tracking-widest text-center">{orderQuery.data.products[0].order.photoSize}</h2>
            </div>
            <div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Nafn: </span>{orderQuery.data.products[0]?.order?.name}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Starfsheiti: </span>{orderQuery.data.products[0]?.order?.job}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Fæðingardagur: </span>{orderQuery.data.products[0]?.order?.birthday}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Dánardagur: </span>{orderQuery.data.products[0]?.order?.deathday}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black leading-5">Minningarorð: </span>{orderQuery.data.products[0]?.order?.memorize}
              </div>
            </div>
            <div className={orderQuery.data.products[0]?.order.name1 ? "" : "hidden"}>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Nafn-1: </span>{orderQuery.data.products[0]?.order?.name1}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Starfsheiti-1: </span>{orderQuery.data.products[0]?.order?.job1}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black">Fæðingardagur-1: </span>{orderQuery.data.products[0]?.order?.birthday1}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black"> Dánardagur-1:</span>{orderQuery.data.products[0]?.order?.deathday1}
              </div>
              <div className="text-md leading-3 text-gray-600 pt-2">
                {" "}
                <span className="text-black leading-5">Minningarorð-1: </span> {orderQuery.data.products[0]?.order?.memorize1}
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};
