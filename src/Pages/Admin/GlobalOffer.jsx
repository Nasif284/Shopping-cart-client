import React, { useState } from "react";
import GlobalOfferTable from "../../Components/Admin/GlobalOfferTable";

const GlobalOffer = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <GlobalOfferTable params={params} setParams={setParams} />
    </div>
  );
};

export default GlobalOffer;
