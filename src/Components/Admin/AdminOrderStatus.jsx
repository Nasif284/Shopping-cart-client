import React from "react";

const OrderStatus = ({ currentStatus, statusHistory }) => {
  const STATUS_FLOW = [
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Return Requested",
    "Return Approved",
    "Return Rejected",
    "Cancelled",
  ];
  let activeIndex = STATUS_FLOW.indexOf(currentStatus);
  if (currentStatus == "Cancelled") {
    return (
      <div className="flex justify-between items-center relative">
        {statusHistory.map((history, idx, arr) => {
          return (
            <div
              key={history.status}
              className="flex flex-col flex-1 relative "
            >
              {idx !== arr.length - 1 && (
                <div
                  className={`absolute  top-2 left-0 right-0 h-0.5 bg-red-500`}
                ></div>
              )}
              <div
                className={`w-4 h-4 rounded-full z-10 bg-red-500
                `}
              ></div>
              <div className="relative pb-9">
                <p
                  className={`text-xs font-medium mt-1 text-red-500
                  `}
                >
                  {history.status}
                </p>
                <p className="text-[10px] absolute top-5 left-0 text-gray-500">
                  {new Date(history.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
                {history?.note?.length > 0 && (
                  <p className="!mt-4">{history?.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center relative">
      {STATUS_FLOW.slice(
        0,
        currentStatus === "Cancelled" ||
          currentStatus === "Return Rejected" ||
          currentStatus === "Return Requested" ||
          currentStatus === "Return Approved"
          ? activeIndex + 1
          : 5
      ).map((status, idx, arr) => {
        const isActive = idx <= activeIndex;
        const history = statusHistory?.find((h) => h.status === status);
        if (
          currentStatus === "Return Rejected" &&
          status == "Return Approved"
        ) {
          return;
        }
        return (
          <div key={status} className="flex flex-col flex-1 relative ">
            {idx !== arr.length - 1 && (
              <div
                className={`absolute  top-2 left-0 right-0 h-0.5 ${
                  isActive ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
            )}
            <div
              className={`w-4 h-4 rounded-full z-10 ${
                isActive ? "bg-red-500" : "bg-gray-300"
              }`}
            ></div>
            <div className="relative pb-9">
              <p
                className={`text-xs font-medium mt-1 ${
                  isActive ? "text-red-500" : "text-gray-600"
                }`}
              >
                {status}
              </p>

              <p className="text-[10px] absolute top-5 left-0 text-gray-500">
                {history
                  ? new Date(history.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : ""}
              </p>
              {history?.note?.length > 0 && (
                <p className="!mt-4">{history?.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatus;
