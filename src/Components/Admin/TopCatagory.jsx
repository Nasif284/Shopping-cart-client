import React, { useState } from "react";
import AdminTable from "./AdminTable";
import { useGetTopSellingCategoriesQuery } from "../../Store/Api/admin/orders";
const topCategoryColumns = [
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

function topCategoryCreateData(
  category,
  totalQuantitySold,
  totalRevenue,
  orderCount
) {
  return { category, totalQuantitySold, totalRevenue, orderCount };
}

const TopCategory = ({ filter }) => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const { data } = useGetTopSellingCategoriesQuery({ ...params, ...filter });
  const topProductsRows = data?.categories.map((category) =>
    topCategoryCreateData(
      category._id,
      category.count,
      <span>₹{category.totalRevenue.toLocaleString()}</span>,
      category.orderCount
    )
  );
  return <AdminTable page={data?.page} setParams={setParams} totalPosts={data?.totalPosts} columns={topCategoryColumns} rows={topProductsRows} />;
};

export default TopCategory;
