import React, { useState } from 'react'
import CategoryOfferTable from '../../Components/Admin/CategoryOfferTable'

const CategoryOffer = () => {
      const [params, setParams] = useState({ page: 1, perPage: 10 });
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <div className="flex my-4 items-center justify-between ">
        <h2 className="text-[18px] font-[600]">Category Offers</h2>
      </div>
        <CategoryOfferTable params={params} setParams={setParams} />
    </div>
  )
}

export default CategoryOffer