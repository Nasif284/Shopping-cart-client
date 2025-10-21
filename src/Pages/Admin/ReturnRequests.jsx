import { useState } from "react";
import FilterAndSearchHeader from "../../Components/Admin/FilterAndSearhcHeader";
import OrdersByItemsTable from "../../Components/Admin/OrdersByItemsTable";
import { ReturnRequestTable, SearchBox } from "../../Components/Admin";
const ReturnRequests = () => {
  const [itemsParams, setItemsParams] = useState({
    page: 1,
    perPage: 10,
    search: "",
  });
  return (
    <div className=" my-4 w-full shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-[18px] font-[600]">All Orders </h2>
        <div className="w-[30%]">
          <SearchBox
            onSearch={(search) =>
              setItemsParams((prev) => ({
                ...prev,
                search: search || undefined,
              }))
            }
          />
        </div>
      </div>

      <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
        <ReturnRequestTable params={itemsParams} setParams={setItemsParams} />
      </div>
    </div>
  );
};

export default ReturnRequests;
