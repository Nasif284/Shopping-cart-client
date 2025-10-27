import { useState } from "react";
import { OrdersTable, SearchBox, SelectBox } from "../../Components/Admin";
import FilterAndSearchHeader from "../../Components/Admin/FilterAndSearhcHeader";
import OrdersByItemsTable from "../../Components/Admin/OrdersByItemsTable";
const AdminOrders = () => {
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    status: "",
    search: "",
    sortBy: "",
  });
  const [itemsParams, setItemsParams] = useState({
    page: 1,
    perPage: 10,
    status: "",
    search: "",
    sortBy: "",
  });
  const [type, setType] = useState("By Order ID");
  const statuses = [
    "Confirmed",
    "Processing",
    "Partially Shipped",
    "Partially Delivered",
    "Completed",
    "Cancelled",
    "Return Approved",
  ];
  const itemStatuses = [
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
  return (
    <div className=" my-4 w-full shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-[18px] font-[600]">All Orders </h2>
        <SelectBox
          placeholder={"Table Type"}
          statuses={["By Order ID", "By Order Items"]}
          onChange={(val) => setType(val)}
        />
      </div>

      {type === "By Order ID" ? (
        <>
          <div className="flex justify-between px-2">
            <div className="flex gap-3">
              <SelectBox
                placeholder={"Status"}
                statuses={statuses}
                onChange={(status) =>
                  setParams((prev) => ({ ...prev, status }))
                }
              />
              <SelectBox
                placeholder={"Sort By"}
                statuses={[
                  "Amount:Low To High",
                  "Amount:High To Low",
                  "Date:Newest First",
                  "Date:Oldest First",
                ]}
                onChange={(sortBy) =>
                  setParams((prev) => ({ ...prev, sortBy }))
                }
              />
            </div>

            <div>
              <SearchBox
                onSearch={(search) =>
                  setParams((prev) => ({
                    ...prev,
                    search: search || undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
            <OrdersTable params={params} setParams={setParams} />
          </div>
        </>
      ) : (
        <>
          <FilterAndSearchHeader setParams={setItemsParams} />
          <div className="flex gap-5 pl-5">
            <SelectBox
              placeholder={"Status"}
              statuses={itemStatuses}
              onChange={(status) =>
                setItemsParams((prev) => ({ ...prev, status }))
              }
            />
            <SelectBox
              placeholder={"Sort By"}
              statuses={[
                "Amount:Low To High",
                "Amount:High To Low",
                "Date:Newest First",
                "Date:Oldest First",
              ]}
              onChange={(sortBy) =>
                setItemsParams((prev) => ({ ...prev, sortBy }))
              }
            />
          </div>
          <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
            <OrdersByItemsTable
              params={itemsParams}
              setParams={setItemsParams}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
