import React, { useState } from "react";
import GlobalOfferTable from "../../Components/Admin/GlobalOfferTable";
import CouponsTable from "../../Components/Admin/CoupensTable";

const Coupons = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <CouponsTable params={params} setParams={setParams} />
    </div>
  );
};

export default Coupons;
