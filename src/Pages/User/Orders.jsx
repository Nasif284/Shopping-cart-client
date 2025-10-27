import { Badge } from "../../Components/User";
import Button from "@mui/material/Button";
import { useGetOrdersQuery } from "../../Store/Api/user/order";
import { useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
const Orders = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOrdersQuery({ page, perPage: 5 });

  const handlePagination = (e, value) => {
    setPage(value);
  };
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  return (
    <div className="col2 w-[80%]">
      <div className="card bg-white w-full px-3 py-2 shadow-md rounded-md ">
        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
          <h2>Orders</h2>
          <p className="!m-0">
            There are{" "}
            <span className="font-bold text-primary">
              {data.totalPosts || 0}
            </span>{" "}
            Items in Orders
          </p>
        </div>

        <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3  whitespace-nowrap">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  View More
                </th>
              </tr>
            </thead>
            <tbody>
              {data.orders?.map((order, i) => (
                <tr
                  key={order.name + i}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <td className="px-6 py-4  whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="img w-[45px] h-[45px] rounded-md overflow-hidden">
                        <img src={order.items.image} alt="" />
                      </div>
                      <div className="info flex-1 max-w-[170px]">
                        <p className="truncate">{order.items.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.items.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹
                    {(
                      order.items.oldPrice * order.items.quantity
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    ₹
                    {(
                      order.items.price * order.items.quantity
                    ).toLocaleString()}{" "}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Badge status={order.items.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link to={`/orders/${order.items._id}`}>
                      <Button
                        type="submit"
                        className="!bg-primary !rounded-full !capitalize  !text-white !text-[11px] !px-3 !py-1 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                      >
                        View More
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex items-center justify-center py-3">
          <Pagination
            page={page}
            onChange={handlePagination}
            count={data?.totalPages}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
