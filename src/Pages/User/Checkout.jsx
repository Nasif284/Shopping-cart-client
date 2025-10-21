import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import Radio from "@mui/material/Radio";
import { Link, useNavigate } from "react-router-dom";
import { useGetAddressesQuery } from "../../Store/Api/user/address";
import { CircularProgress } from "@mui/material";
import {
  AddNewAddressModal,
  EditAddressModal,
  Razorpay,
} from "../../Components/User";
import SelectAddressModal from "../../Components/User/SelectAddressModal";
import { useDispatch, useSelector } from "react-redux";
import {
  useOrderWithWalletMutation,
  usePlaceOrderMutation,
} from "../../Store/Api/user/order";
import toast from "react-hot-toast";
import SelectCouponModal from "../../Components/User/SelectCouponModal";
import { IoIosClose } from "react-icons/io";
import { applyCoupon, removeCoupon } from "../../Store/StoreSlices/orderSlice";
import {
  useApplyCouponMutation,
  useRemoveAppliedCouponMutation,
} from "../../Store/Api/user/coupen";
import { useGetWalletQuery } from "../../Store/Api/user/wallet";
import PayPalButton from "../../Components/User/PaypalButton";
const Checkout = () => {
  const { data, isLoading } = useGetAddressesQuery();
  const [remove, { isLoading: removeLoading }] =
    useRemoveAppliedCouponMutation();
  const { data: wallet, isLoading: walletLoading } = useGetWalletQuery();
  const [placeOrder, { isLoading: codLoading }] = usePlaceOrderMutation();
  const [selectedAddress, setSelectedAddress] = useState();
  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [code, setCode] = useState();
  const [apply, { isLoading: applyLoading }] = useApplyCouponMutation();
  const [editOpen, setEditOpen] = useState(false);
  const orderItems = useSelector((state) => state.orderItems.items);
  const coupon = useSelector((state) => state.orderItems.coupon);
  const prices = useSelector((state) => state.orderItems.prices);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orderWithWallet, { isLoading: walletOrderLoading }] =
    useOrderWithWalletMutation();
  const handleWalletPayment = async () => {
    const obj = {
      items: orderItems,
      coupon,
      address: selectedAddress,
      prices: {
        subtotal: prices.subtotal,
        discount: prices.discount,
        couponDeduction: coupon?.deduction,
        total: totalPrice,
      },
    };
    try {
      const res = await orderWithWallet(obj).unwrap();
      navigate("/checkout/success");
      toast.success(res.message || "Order Placed Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleRemoveCoupon = async () => {
    try {
      const res = await remove({ items: orderItems }).unwrap();
      dispatch(removeCoupon({ items: res.items }));
      toast.success(res.message || "Coupon Removed Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const totalPrice = orderItems?.reduce(
    (acc, cur) => acc + cur.variant.price * cur.quantity,
    0
  );
  useEffect(() => {
    if (!selectedAddress) {
      setSelectedAddress(data?.addresses[0]);
    }
  }, [data]);
  const handleCodCheckout = async () => {
    if (!selectedAddress) {
      return toast.error("Please add an address");
    }
    const obj = {
      items: orderItems,
      coupon,
      address: selectedAddress,
      prices: {
        subtotal: prices.subtotal,
        discount: prices.discount,
        couponDeduction: coupon?.deduction,
        total: totalPrice,
      },
      payment: { method: "COD", status: "Pending", transactionId: "" },
    };
    try {
      const res = await placeOrder(obj).unwrap();
      navigate("/checkout/success");
      toast.success(res.message || "Order Placed Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleCouponSelection = async () => {
    if (coupon) {
      return toast.error(
        "Only One Coupon is Allowed , please remove selected coupon to select new one"
      );
    }
    try {
      const res = await apply({
        code,
        items: orderItems,
        purchaseValue: totalPrice,
      }).unwrap();
      dispatch(
        applyCoupon({
          items: res.items,
          coupon: { ...res.coupon, deduction: res.couponDeduction },
        })
      );

      toast.success(res.message || "Coupon Applied Successfully");
      setCode("");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };

  if (isLoading || removeLoading || walletLoading) {
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
                  <Button
                    onClick={() => setOpen(true)}
                    className="!bg-primary !px-3 !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                  >
                    <FaPlus />
                    Add new address
                  </Button>
                </div>
              </div>
              {data.addresses.length > 0 && (
                <div className="card relative  py-3 bg-[#FFF2F2] shadow-md rounded-md flex">
                  <div className="px-3">
                    <Radio defaultChecked />
                  </div>
                  <div className="!top-3 !right-5 !absolute flex gap-3">
                    <Button
                      onClick={() => setSelectOpen(true)}
                      className="!bg-primary  !px-2 !mt-2 !text-white !text-[10px] !capitalize !py-1 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                    >
                      Change Address
                    </Button>
                    <Button
                      onClick={() => setEditOpen(true)}
                      className="!bg-blue-400  !px-2 !mt-2 !text-white !text-[10px] !capitalize !py-1 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                    >
                      Edit
                    </Button>
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
              )}
            </div>
            <div className="leftPart w-full shadow-md mt-2 rounded-md p-3 px-5 bg-white">
              <h2>Apply Coupon</h2>
              <div className="py-3 flex bg-[#FFF2F2] shadow-md rounded-md p-2 mt-2">
                <input
                  type="text"
                  className="w-[90%] outline-none border-0"
                  placeholder="Enter Coupon Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <Button
                  type="submit"
                  onClick={handleCouponSelection}
                  className="!bg-primary !capitalize  !text-white !text-[12px]    hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
                >
                  {applyLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              <button onClick={() => setCouponOpen(true)}>
                <Link className="link text-[12px] font-[400] mt-1">
                  View Coupons
                </Link>
              </button>
              {coupon && (
                <div className="my-2">
                  <span className=" bg-[#f1f1f1]  text-[13px] rounded-md py-1 px-2 inline-flex items-center font-[600] cursor-pointer ">
                    {coupon.code} : {coupon.description} coupon applied{" "}
                    <button
                      className="!cursor-pointer"
                      onClick={handleRemoveCoupon}
                    >
                      <IoIosClose className="text-[22px] text-primary" />
                    </button>
                  </span>
                </div>
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
                          src={item?.variant?.images[0]}
                          alt=""
                        />
                      </div>
                      <div className="h-[45px] overflow-hidden">
                        <p className="font-[600] !m-0 overflow-hidden h-[23px]">
                          {item?.product?.name}
                        </p>
                        <p className="!m-0 !text-[12px]">
                          Qty: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[12px]">
                      <span className="text-primary line-through">
                        ₹
                        {(
                          item?.variant.oldPrice * item?.quantity
                        ).toLocaleString()}
                      </span>
                      <span>
                        ₹
                        {(
                          item?.variant.price * item?.quantity
                        ).toLocaleString()}
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
                  items: orderItems,
                  coupon,
                  address: selectedAddress,
                  prices: {
                    subtotal: prices.subtotal,
                    discount: prices.discount,
                    couponDeduction: coupon?.deduction,
                    total: totalPrice,
                  },
                }}
              />
              {/* <Button
                type="submit"
                className="!bg-black w-full !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
              >
                <IoBagCheckOutline className="text-[16px]" />
                Paypal
              </Button> */}
              <div className="!mt-2">
                <PayPalButton
                  amount={totalPrice}
                  payload={{
                    items: orderItems,
                    coupon,
                    address: selectedAddress,
                    prices: {
                      subtotal: prices.subtotal,
                      discount: prices.discount,
                      couponDeduction: coupon?.deduction,
                      total: totalPrice,
                    },
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
              {totalPrice < 1001 && (
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
              )}
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

export default Checkout;
