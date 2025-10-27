import React from "react";
import { failed } from "../../Assets";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const OrderFiled = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <img src={failed} alt="" className="w-[100px]" />
      <p className="!text-[20px] !mb-0 text-gray-600">Payment Filed</p>
      <p className="text-gray-600 mb-5">
        Something went wrong with your payment. <br /> Don’t worry — you can
        retry your order.
      </p>
      <Button
        onClick={() => navigate("/orders")}
        className="!bg-primary !text-white"
      >
        Go to My Orders
      </Button>
    </div>
  );
};

export default OrderFiled;
