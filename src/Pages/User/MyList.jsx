import React from "react";
import { MyListItems } from "../../Components/User";
import { useGetWishlistQuery } from "../../Store/Api/user/wishlist";
import { CircularProgress } from "@mui/material";
const MyList = () => {
  const { data, isLoading } = useGetWishlistQuery();
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  return (
    <div className="col2 w-[50%]">
      <div className="card bg-white px-3 py-2 shadow-md rounded-md ">
        <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
          <h2>Your Cart</h2>
          <p className="!m-0">
            There are <span className="font-bold text-primary">{ data.wishlist.length}</span> Items in
            your cart
          </p>
        </div>
        {data.wishlist.map((item) => (
          <MyListItems item={item} />
        ))}
      </div>
    </div>
  );
};

export default MyList;
