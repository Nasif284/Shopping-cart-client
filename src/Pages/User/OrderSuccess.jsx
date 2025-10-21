import React from "react";
import { success } from "../../Assets";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <img src={success} alt="" className="w-[100px]" />
      <p className="!text-[20px] !mb-0 text-gray-600">
       Order Placed Successfully
      </p>
      <Link
        to={"/orders"}
        className="mt-5 px-4 py-2 bg-primary text-white rounded-md hover:bg-black transition"
      >
        Go to orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
