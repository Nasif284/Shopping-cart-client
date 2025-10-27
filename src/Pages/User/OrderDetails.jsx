import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../Store/Api/user/order";
import { OrderStatus, ReasonModal } from "../../Components/User";
import { Button } from "@mui/material";
import AddReviewModal from "../../Components/User/AddReviewModal";
const baseUrl = import.meta.env.VITE_API_URL;
const OrderDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [type, setType] = useState("");
  const { data, isLoading } = useGetOrderByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const estimatedDeliveryDate = new Date(data?.order.createdAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  const isDelivered = data.displayItem.statusHistory.find(
    (e) => e.status == "Delivered"
  );
  return (
    <>
      <div className="col2 w-[90%]">
        <div className="card bg-white w-full px-6 py-6 shadow-md rounded-md  ">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Order ID:
                <span className="font-normal">{data?.order.orderId}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Order date:{" "}
                <span className="text-black">
                  {new Date(data?.order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              {data.displayItem.status != "Cancelled" &&
                data.displayItem.status != "Failed" &&
                data.displayItem.status != "Return Approved" &&
                data.displayItem.status != "Return Requested" &&
                data.displayItem.status != "Delivered" && (
                  <p className="text-sm text-red-500 font-medium">
                    Estimated delivery:{" "}
                    {estimatedDeliveryDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                )}
            </div>
            <div className="flex gap-3">
              {data.displayItem.status != "Return Requested" &&
                data.displayItem.status != "Return Approved" &&
                data.displayItem.status != "Cancelled" &&
                data.displayItem.status != "Failed" && (
                  <button
                    onClick={() => {
                      setOpen(true);
                      if (data.displayItem.status == "Delivered") {
                        setType("Return");
                      } else {
                        setType("Cancel");
                      }
                    }}
                    className="px-3 py-1 border rounded-md text-sm cursor-pointer"
                  >
                    {data.displayItem.status == "Delivered"
                      ? "Return Order"
                      : "Cancel Order"}
                  </button>
                )}

              {isDelivered && (
                <a
                  href={`${baseUrl}/api/user/orders/${data.displayItem._id}/invoice`}
                  className="px-3 py-1 border rounded-md text-sm cursor-pointer"
                >
                  Invoice
                </a>
              )}
            </div>
          </div>
          {data.displayItem.status !== "Failed" && (
            <OrderStatus
              currentStatus={data?.displayItem.status}
              statusHistory={data?.displayItem.statusHistory}
            />
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 overflow-hidden rounded-md">
              <img src={data?.displayItem.image} alt="" />
            </div>
            <div className="flex-1 relative">
              <h3 className="font-medium">{data.displayItem.name}</h3>
              {(!data?.displayItem.review.comment ||
                !data?.displayItem.review.rating) &&
                isDelivered && (
                  <Button
                    onClick={() => {
                      setReviewOpen(true);
                    }}
                    className="!bg-primary !absolute top-0 right-0 !px-2 !mt-2 !text-white !capitalize !text-[12px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                  >
                    Add Review
                  </Button>
                )}

              {data.displayItem.status == "Failed" && (
                <Link to={`/checkout/retry/${data.order._id}`}>
                  <Button className="!bg-primary !absolute top-0 right-0 !px-2 !mt-2 !text-white !capitalize !text-[12px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]">
                    Retry Order
                  </Button>
                </Link>
              )}
              <div className="flex gap-5">
                <p className="text-sm text-gray-600">
                  Brand: {data.displayItem.product.brand}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {data.displayItem.quantity}
                </p>
                {data.displayItem.size && (
                  <p className="text-sm text-gray-600">
                    Size: {data.displayItem.size}
                  </p>
                )}

                {data.displayItem.color && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    Color:
                    <span
                      className={`h-[15px] flex w-[15px] rounded-full`}
                      style={{ backgroundColor: data.displayItem.color }}
                    ></span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-1">Payment</h4>
              <p className="flex items-center text-sm text-gray-700">
                {data.order.payment.method == "COD"
                  ? "Cash On Delivery"
                  : data.order.payment.method}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Delivery</h4>
              <p className="text-sm text-gray-700">
                <span className="font-[500]">
                  {" "}
                  {data.order.shippingAddress.name}
                </span>{" "}
                <br />
                {data.order.shippingAddress.address_line +
                  ", " +
                  data.order.shippingAddress.locality +
                  ", " +
                  data.order.shippingAddress?.city +
                  ", " +
                  data.order.shippingAddress?.state}
                <span className="font-[500]">
                  {" "}
                  - {data.order.shippingAddress?.pin_code}
                </span>
                <br />
                <span className="font-[500]">
                  {" "}
                  {data.order.shippingAddress?.mobile},{" "}
                  {data.order.shippingAddress?.alternative_mobile}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Price</span>
              <span>
                Rs.
                {(
                  data.displayItem.oldPrice * data.displayItem.quantity
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Discount</span>
              <span>
                Rs.
                {(
                  data.displayItem.oldPrice * data.displayItem.quantity -
                  data.displayItem.price * data.displayItem.quantity
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span className="text-black">
                Rs.{" "}
                {(
                  data.displayItem.price * data.displayItem.quantity
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {data.relatedItems.length > 0 && (
          <div className="card bg-white w-full px-6 py-6 shadow-md rounded-md mt-3  ">
            <h2>
              Other items in this order ID:{" "}
              <span className="font-normal">{data?.order.orderId}</span>{" "}
            </h2>
            {data.relatedItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-6 mt-5">
                <div className="w-16 h-16 bg-gray-200 overflow-hidden rounded-md">
                  <img src={item.image} alt="" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <Link to={`/orders/${item._id}`}>
                  <Button
                    type="submit"
                    className="!bg-primary !rounded-full !capitalize  !text-white !text-[11px] !px-3 !py-1 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                  >
                    View More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {open && (
        <ReasonModal
          item={data.displayItem}
          open={open}
          handleClose={() => setOpen(false)}
          type={type}
        />
      )}
      {reviewOpen && (
        <AddReviewModal
          open={reviewOpen}
          handleClose={() => setReviewOpen(false)}
          item={data.displayItem}
        />
      )}
    </>
  );
};

export default OrderDetails;
