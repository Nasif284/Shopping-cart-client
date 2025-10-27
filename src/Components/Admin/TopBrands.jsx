import React, { useState } from "react";
import AdminTable from "./AdminTable";
import { useGetTopSellingBrandsQuery } from "../../Store/Api/admin/orders";
const topBrandsColumns = [
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

function topBrandsCreateData(
  category,
  totalQuantitySold,
  totalRevenue,
  orderCount
) {
  return { category, totalQuantitySold, totalRevenue, orderCount };
}

const TopBrands = ({ filter }) => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const { data } = useGetTopSellingBrandsQuery({ ...params, ...filter });
  const topBrandsRows = data?.brands.map((brand) =>
    topBrandsCreateData(
      brand._id,
      brand.count,
      <span>₹{brand.totalRevenue.toLocaleString()}</span>,
      brand.orderCount
    )
  );
  return (
    <AdminTable
      page={data?.page}
      setParams={setParams}
      totalPosts={data?.totalPosts}
      columns={topBrandsColumns}
      rows={topBrandsRows}
    />
  );
};

export default TopBrands;
