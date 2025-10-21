import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import Radio from "@mui/material/Radio";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {
  AddNewAddressModal,
  EditAddressModal,
  Razorpay,
} from "../../Components/User";
import SelectAddressModal from "../../Components/User/SelectAddressModal";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetFailedOrderQuery,
  useRetryFiledOrderWithCodMutation,
  useRetryFiledOrderWithWalletMutation,
} from "../../Store/Api/user/order";
import toast from "react-hot-toast";
import SelectCouponModal from "../../Components/User/SelectCouponModal";
import { createOrderItems } from "../../Store/StoreSlices/orderSlice";
import { useGetWalletQuery } from "../../Store/Api/user/wallet";
import PayPalButton from "../../Components/User/PaypalButton";
const CheckoutRetry = () => {
  const { id } = useParams();
  const [retryCod, { isLoading: codLoading }] =
    useRetryFiledOrderWithCodMutation();
  const [retryWallet, { isLoading: walletOrderLoading }] =
    useRetryFiledOrderWithWalletMutation();
  const { data: failed, isLoading: orderLoading } = useGetFailedOrderQuery(id);
  const { data: wallet, isLoading: walletLoading } = useGetWalletQuery();
  const [selectedAddress, setSelectedAddress] = useState();
  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  let totalPrice;
  useEffect(() => {
    if (failed?.order) {
      dispatch(
        createOrderItems({
          items: failed?.order.items,
          prices: failed?.order.prices,
          coupon: failed?.order.coupon.code ? failed?.order.coupon : null,
        })
      );
      setSelectedAddress(failed?.order.shippingAddress);
    }
  }, [failed, dispatch]);
  totalPrice = failed?.order.prices.total;

  const orderItems = useSelector((state) => state.orderItems.items);
  const coupon = useSelector((state) => state.orderItems.coupon);
  const prices = useSelector((state) => state.orderItems.prices);
  const navigate = useNavigate();

  const handleWalletPayment = async () => {
    const obj = {
      id,
      amount: totalPrice,
      items: orderItems,
    };
    try {
      const res = await retryWallet(obj).unwrap();
      navigate("/checkout/success");
      toast.success(res.message || "Order Placed Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleCodCheckout = async () => {
    if (!selectedAddress) {
      return toast.error("Please add an address");
    }
    const obj = {
      id,
      payment: { method: "COD", status: "Pending", transactionId: "" },
      items: orderItems,
    };
    try {
      const res = await retryCod(obj).unwrap();
      navigate("/checkout/success");
      toast.success(res.message || "Order Placed Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };

  if (walletLoading || orderLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return (
    <>
      <section className="py-5 ">
        <div className="container flex w-[60%] max-w-[80%] pb-10 gap-4">
          <div className="w-[75%]">
            <div className="leftPart w-full shadow-md rounded-md p-3 px-5 bg-white">
              <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
                <div className="head flex items-center justify-between">
                  <h2>Select Delivery Address</h2>
                </div>
              </div>

              <div className="card relative  py-3 bg-[#FFF2F2] shadow-md rounded-md flex">
                <div className="px-3">
                  <Radio defaultChecked />
                </div>

                <div className="address">
                  <span className=" bg-[#f1f1f1] text-[13px] rounded-md py-1 px-2 font-[600] cursor-pointer ">
                    {selectedAddress?.type}
                  </span>
                  <div className="mt-2">
                    <h1>{selectedAddress?.name}</h1>
                    <p className="!mt-1">
                      {selectedAddress?.address_line +
                        ", " +
                        selectedAddress?.locality +
                        ", " +
                        selectedAddress?.city +
                        ", " +
                        selectedAddress?.state}
                      <span className="font-[500]">
                        {" "}
                        - {selectedAddress?.pin_code}
                      </span>
                    </p>
                    <p>
                      <span className="font-[500]">Phone:</span>{" "}
                      {selectedAddress?.mobile},{" "}
                      {selectedAddress?.alternative_mobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="leftPart w-full shadow-md mt-2 rounded-md p-3 px-5 bg-white">
              <h2> Coupon</h2>

              {coupon ? (
                <div className="my-2">
                  <span className=" bg-[#f1f1f1]  text-[13px] rounded-md py-1 px-2 inline-flex items-center font-[600] cursor-pointer ">
                    {coupon.code} : {coupon.description} coupon applied{" "}
                  </span>
                </div>
              ) : (
                <span className="text-[12px]">No Coupon Applied</span>
              )}
            </div>
          </div>

          <div className="w-[40%] rightPart">
            <div className="bg-white rounded-md shadow-md p-5">
              <div className="py-2 border-b border-[rgba(0,0,0,0.1)]">
                <h3>Your Order</h3>
              </div>
              <div className="py-2 flex justify-between border-b border-[rgba(0,0,0,0.1)]">
                <h5 className="text-[14px]">Items</h5>
                <h5 className="text-[14px]">Price</h5>
              </div>
              <div className="items max-h-[210px] overflow-y-scroll">
                {orderItems.map((item) => (
                  <div
                    key={item?._id}
                    className="product w-full pr-2  border-b border-[rgba(0,0,0,0.1)] py-2 flex items-center justify-between"
                  >
                    <div className="col1 w-[90%]  flex gap-2">
                      <div className="imgWrapper h-[50px] w-[50px] rounded-md overflow-hidden">
                        <img
                          className="object-cover object-center w-full h-full"
                          src={item?.image}
                          alt=""
                        />
                      </div>
                      <div className="h-[45px] overflow-hidden">
                        <p className="font-[600] !m-0 overflow-hidden h-[23px]">
                          {item?.name}
                        </p>
                        <p className="!m-0 !text-[12px]">
                          Qty: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[12px]">
                      <span className="text-primary line-through">
                        ₹{(item?.oldPrice * item?.quantity).toLocaleString()}
                      </span>
                      <span>
                        ₹{(item?.price * item?.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-b border-[rgba(0,0,0,0.1)] py-3">
                <div className="py-1 flex justify-between">
                  <p className="font-[600] text-[14px] !m-0">Total Price</p>
                  <p className="!m-0">₹{prices.subtotal.toLocaleString()}</p>
                </div>
                <div className="py-1 flex justify-between">
                  <p className="font-[600] text-[14px] !m-0">Total Discount</p>
                  <p className="!m-0">-₹{prices.discount.toLocaleString()}</p>
                </div>
                <div className="py-1 flex justify-between">
                  <p className="font-[600] text-[14px] !m-0">Coupon Applied</p>
                  <p className="!m-0">
                    -₹{coupon ? coupon.deduction.toLocaleString() : 0}
                  </p>
                </div>
                <div className="py-1 flex justify-between">
                  <p className="font-[600] text-[14px] !m-0">Shipping fee</p>
                  <p className="!m-0">Free</p>
                </div>
              </div>
              <div className="py-3 flex justify-between">
                <p className="font-[600] text-[14px] !m-0">Total Amount</p>
                <p className="!m-0 font-[600]">
                  ₹{totalPrice.toLocaleString()}
                </p>
              </div>

              <Razorpay
                amount={totalPrice}
                payload={{
                    id,
                    items: orderItems,
                    failed: true
                }}
                failed={true}
              />
              <div className="!mt-2">
                <PayPalButton
                  amount={totalPrice}
                  payload={{
                    id: failed._id,
                  }}
                />
              </div>

              {wallet?.wallet?.balance > totalPrice && (
                <Button
                  type="submit"
                  onClick={handleWalletPayment}
                  className="!bg-primary w-full !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
                >
                  {walletOrderLoading ? (
                    <CircularProgress size={30} color="inherit" />
                  ) : (
                    <>
                      <IoBagCheckOutline className="text-[16px]" />
                      Pay with Valet{" "}
                      <span className="capitalize text-[12px]">
                        (Balance: Rs.{wallet.wallet.balance.toLocaleString()})
                      </span>
                    </>
                  )}
                </Button>
              )}
              <Button
                type="submit"
                onClick={handleCodCheckout}
                className="!bg-black w-full !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
              >
                {codLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>
                    <IoBagCheckOutline className="text-[16px]" />
                    Cash on Delivery
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {open && (
        <AddNewAddressModal open={open} handleClose={() => setOpen(false)} />
      )}
      {selectOpen && (
        <SelectAddressModal
          open={selectOpen}
          handleClose={() => setSelectOpen(false)}
          setSelected={setSelectedAddress}
        />
      )}
      {editOpen && (
        <EditAddressModal
          address={selectedAddress}
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          update={(updated) => setSelectedAddress(updated)}
        />
      )}
      {couponOpen && (
        <SelectCouponModal
          open={couponOpen}
          handleClose={() => setCouponOpen(false)}
          purchaseValue={totalPrice}
          items={orderItems}
          coupon={coupon}
        />
      )}
    </>
  );
};

export default CheckoutRetry;
