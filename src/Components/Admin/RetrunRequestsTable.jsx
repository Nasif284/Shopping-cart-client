import AdminTable from "./AdminTable";
import { Button, Tooltip } from "@mui/material";
import { Badge } from "../User";
import { useGetReturnRequestsQuery } from "../../Store/Api/admin/orders";
import { Link } from "react-router-dom";
const ProductsColumns = [
  { id: "orderId", label: "Order Id", minWidth: 200 },
  {
    id: "userName",
    label: "User Name",
    minWidth: 200,
  },
  {
    id: "item",
    label: "Item",
    minWidth: 100,
  },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 50,
  },
  {
    id: "price",
    label: "Price",
    minWidth: 50,
  },
  {
    id: "date",
    label: "Date",
    minWidth: 100,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 150,
  },
  {
    id: "more",
    label: "View More",
    minWidth: 150,
  },
];

function productsCreateData(
  orderId,
  userName,
  item,
  quantity,
  price,
  date,
  status,
  more
) {
  return {
    orderId,
    userName,
    item,
    quantity,
    price,
    date,
    status,
    more,
  };
}

const ReturnRequestTable = ({ params, setParams }) => {
  const { data, isLoading } = useGetReturnRequestsQuery(params);
  console.log(data);
  const ProductsRows = data?.orders?.map((order) =>
    productsCreateData(
      order.orderId,
      order.user.name,
      <div className="flex items-center gap-2">
        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden">
          <img src={order.items.image} alt="" />
        </div>
        <div className="info flex-1 max-w-[170px]">
          <p className="truncate">{order.items.name}</p>
        </div>
      </div>,
      order.items.quantity,
      order.items.price,
      new Date(order.createdAt).toLocaleDateString("en-GB"),
      <Badge status={order.items.status} />,
      <Link to={`/admin/orders/items/${order.items._id}`}>
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
      page={data?.page}
      setParams={setParams}
      totalPosts={data.totalPosts}
    />
  );
};

export default ReturnRequestTable;
