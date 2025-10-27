import { useState } from "react";
import { useGetTopSellingProductsQuery } from "../../Store/Api/admin/orders";
import AdminTable from "./AdminTable";
import { Tooltip } from "@mui/material";
const topProductsColumns = [
  { id: "productName", label: "Product name", minWidth: 170 },
  { id: "category", label: "Category", minWidth: 100 },
  {
    id: "totalQuantitySold",
    label: "Total quantity sold",
    minWidth: 100,
    align: "center",
  },
  {
    id: "totalRevenue",
    label: "	Total Revenue	",
    minWidth: 100,
    align: "center",
  },
  {
    id: "orderCount",
    label: "Order Count",
    minWidth: 100,
    align: "center",
  },
];

function topProductsCreateData(
  productName,
  category,
  totalQuantitySold,
  totalRevenue,
  orderCount
) {
  return { productName, category, totalQuantitySold, totalRevenue, orderCount };
}

const TopProducts = ({ filter }) => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const { data } = useGetTopSellingProductsQuery({ ...params, ...filter });
  const topProductsRows = data?.products.map((product) =>
    topProductsCreateData(
      <Tooltip title={product._id} placement="top">
        <div className="info max-w-[180px] truncate">{product._id}</div>
      </Tooltip>,
      product.category,
      product.count,
      <span>₹{product.totalRevenue.toLocaleString()}</span>,
      product.orderCount
    )
  );

  return (
    <AdminTable
      setParams={setParams}
      page={data?.page}
      totalPosts={data?.totalPosts}
      columns={topProductsColumns}
      rows={topProductsRows}
    />
  );
};

export default TopProducts;
