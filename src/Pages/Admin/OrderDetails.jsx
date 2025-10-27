import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useApproveReturnMutation,
  useGetItemsByOrderIdQuery,
  useRejectReturnMutation,
} from "../../Store/Api/admin/orders";
import { Button, CircularProgress } from "@mui/material";
import { OrderStatusModal } from "../../Components/Admin";
import AdminOrderStatus from "../../Components/Admin/AdminOrderStatus";
import toast from "react-hot-toast";
const OrderDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [reject, { isLoading: rejectLoading }] = useRejectReturnMutation();
  const [approve, { isLoading: approveLoading }] = useApproveReturnMutation();
  const { data, isLoading } = useGetItemsByOrderIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [item, setItem] = useState();
  const estimatedDeliveryDate = new Date(data?.order.createdAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  const handleReturnReject = async (id) => {
    try {
      const res = await reject(id).unwrap();
      toast.success(res.message || "Request rejected Successfully");
    } catch (error) {
      toast.error(error.data || "Status updating failed");
    }
  };
  const handleReturnApprove = async (id) => {
    try {
      const res = await approve(id).unwrap();
      toast.success(res.message || "Request approved Successfully");
    } catch (error) {
      toast.error(error.data || "Status updating failed");
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <div className="col2 w-[90%]">
        <div className="card bg-white w-full px-6 py-6 shadow-md rounded-md  ">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Order ID:{" "}
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
            </div>
          </div>
          {data.order.items.map((item, i) => (
            <div key={item._id} className="">
              <div className="flex mt-3 items-center gap-4 mb-6">
                <span>{i + 1}</span>

                <div className="w-16 h-16 bg-gray-200 overflow-hidden rounded-md">
                  <img src={item.image} alt="" />
                </div>
                <div className="flex-1 relative">
                  <div className="flex w-full justify-between">
                    <h3 className="font-medium w-[85%]">{item.name}</h3>
                    {item.status !== "Cancelled" &&
                      item.status !== "Delivered" &&
                      item.status !== "Return Requested" &&
                      item.status !== "Return Approved" && (
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setItem(item);
                          }}
                          className="!bg-primary !absolute top-0 right-0 !px-2 !mt-2 !text-white !capitalize !text-[12px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                        >
                          Change Status
                        </Button>
                      )}
                  </div>
                  <div className="flex gap-5">
                    <p className="text-sm text-gray-600">
                      Brand: {item.product.brand}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    )}

                    {item.color && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        Color:
                        <span
                          className={`h-[15px] flex w-[15px] rounded-full`}
                          style={{ backgroundColor: item.color }}
                        ></span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <AdminOrderStatus
                currentStatus={item.status}
                statusHistory={item.statusHistory}
              />
              {item.status == "Cancelled" && (
                <div className="flex gap-2 mb-5">
                  <h1>Cancel Reason:</h1>
                  <p className="!m-0">{item.cancelReason}</p>
                </div>
              )}
              {(item.status == "Return Requested" ||
                item.status == "Return Approved" ||
                item.status == "Return Rejected") && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2 mb-5 items-center">
                    <h1>Return Reason:</h1>
                    <p className="!m-0">{item.returnReason}</p>
                  </div>
                  {item.status == "Return Requested" && (
                    <div className="flex gap-3 items-center">
                      <Button
                        onClick={() => handleReturnApprove(item._id)}
                        className="!bg-green-600  top-0 right-0 !px-2 !mt-2 !text-white !capitalize !text-[12px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                      >
                        {approveLoading ? (
                          <CircularProgress size={30} color="inherit" />
                        ) : (
                          <> Approve </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReturnReject(item._id)}
                        className="!bg-primary  top-0 right-0 !px-2 !mt-2 !text-white !capitalize !text-[12px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                      >
                        {rejectLoading ? (
                          <CircularProgress size={30} color="inherit" />
                        ) : (
                          <> Reject </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-1">Payment</h4>
              <p className="flex items-center text-sm text-gray-700">
                {(data.order.payment.method == "COD" && "Cash On Delivery") ||
                  data.order.payment.method}
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
              <span>Rs. {data.order.prices.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Discount</span>
              <span>Rs. {data.order.prices.discount}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Coupon applied</span>
              <span>
                Rs.{data?.order?.coupon?.deduction.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span className="text-black">Rs. {data.order.prices.total}</span>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <OrderStatusModal
          item={item}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default OrderDetails;
