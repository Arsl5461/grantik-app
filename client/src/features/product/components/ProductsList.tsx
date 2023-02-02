import { Table, Spinner, Link } from "../../../components/Elements";
import { formatDate } from "../../../utils/format";

import { useProducts } from "../api/getProducts";
import { Product } from "../types";

import { DeleteProduct } from "./DeleteProduct";

export const ProductsList = () => {
  const productsQuery = useProducts();

  if (productsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!productsQuery.data) return null;

  return (
    <Table<Product>
      data={productsQuery.data}
      columns={[
        {
          title: "Nafn",
          field: "name",
        },
        {
          title: "Verð",
          field: "price",
        },
        {
          title: "Tegund",
          field: "type",
        },
        {
          title: "Mynd",
          field: "imageUrl",
          Cell({ entry: { imageUrl } }) {
            return <img src={imageUrl} alt="item" width={70}/>;
          },
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
            return <DeleteProduct id={_id} />;
          },
        },
      ]}
    />
  );
};
