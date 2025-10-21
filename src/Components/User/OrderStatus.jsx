import React from "react";

const OrderStatus = ({ currentStatus, statusHistory }) => {
  console.log(statusHistory);
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
  if (currentStatus === "Cancelled" ) {
    const confirmedHistory = statusHistory?.find(
      (h) => h.status === "Confirmed"
    );
    const currentHistory = statusHistory?.find(
      (h) => h.status === currentStatus
    );
    return (
      <div className="flex justify-between items-center relative w-full">
        <div className="flex flex-col  flex-1 relative">
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-red-500"></div>
          <div className="w-4 h-4 rounded-full bg-red-500 z-10"></div>
          <p className="text-xs !mb-0 font-medium mt-1 text-red-500">
            Confirmed
          </p>
          <p className="text-[10px] !mt-0 text-gray-500">
            {confirmedHistory
              ? new Date(confirmedHistory.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </p>
        </div>
        <div className="flex flex-col flex-1 relative">
          <div className="w-4 h-4 rounded-full bg-red-500 z-10"></div>
          <p className="text-xs !mb-0 font-medium mt-1 text-red-500">
            {currentStatus}
          </p>
          <p className="text-[10px] !mt-0 text-gray-500">
            {currentHistory
              ? new Date(currentHistory.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : ""}
            {currentHistory?.note?.length > 0 && (
              <p className="!mt-4">{history?.note}</p>
            )}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center relative">
      {STATUS_FLOW.slice(
        0,
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
          return
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
