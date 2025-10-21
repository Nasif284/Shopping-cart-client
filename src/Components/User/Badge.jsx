import React from "react";

const Badge = ({ status }) => {
  return (
    <span
      className={`flex text-[11px] items-center justify-center py-1 font-[500] ${(status === "Failed" || status === "Cancelled" || status === "Return Requested" || status == "Return Rejected") && "bg-primary"} ${(status === "Confirmed" || status === "Partially Delivered" || status === "Partially Shipped" || status === "Processing") && "bg-yellow-500"} ${(status === "Completed" || status == "Delivered" || status == "Return Approved" || status == "Out for Delivery") && "bg-green-600"} !text-white font-[500] rounded-full capitalize`}
    >
      {status}
    </span>
  );
};

export default Badge;
