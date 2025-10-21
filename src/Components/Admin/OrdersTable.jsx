import AdminTable from "./AdminTable";
import { Button, Tooltip } from "@mui/material";
import { Badge } from "../User";
import { useAdminGetOrdersQuery } from "../../Store/Api/admin/orders";
import { Link } from "react-router-dom";
const ProductsColumns = [
  { id: "orderId", label: "Order Id", minWidth: 100 },
  {
    id: "userName",
    label: "User Name",
    minWidth: 100,
  },
  {
    id: "numberOfItems",
    label: "No Of Items",
    minWidth: 100,
  },
  {
    id: "totalAmount",
    label: "Total Amount",
    minWidth: 100,
  },
  {
    id: "date",
    label: "Date",
    minWidth: 100,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
  },
  {
    id: "more",
    label: "View More",
    minWidth: 100,
  },
];

function productsCreateData(
  orderId,
  userName,
  numberOfItems,
  totalAmount,
  date,
  status,
  more
) {
  return {
    orderId,
    userName,
    numberOfItems,
    totalAmount,
    date,
    status,
    more,
  };
}

const OrdersTable = ({ params, setParams }) => {
  const { data, isLoading } = useAdminGetOrdersQuery(params);
  const ProductsRows = data?.orders?.map((order) =>
    productsCreateData(
      order.orderId,
      order.user.name,
      order.items.length,
      <span>₹{order.prices.total.toLocaleString()}</span>,
      new Date(order.createdAt).toLocaleDateString("en-GB"),
      <Badge status={order.orderStatus} />,
      <Link to={`/admin/orders/${order._id}`}>
        <Button
          type="submit"
          className="!bg-primary !rounded-full !capitalize  !text-white !text-[11px] !px-3 !py-1 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
        >
          View More
        </Button>
      </Link>
    )
  );
  if (isLoading) {
    return <h1>Loading..</h1>;
  }
  return (
    <AdminTable
      columns={ProductsColumns}
      rows={ProductsRows}
      page={data.page}
      setParams={setParams}
      totalPosts={data.totalPosts}
    />
  );
};

export default OrdersTable;
