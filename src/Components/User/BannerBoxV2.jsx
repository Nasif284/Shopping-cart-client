import React from "react";
import { Link } from "react-router-dom";
import { chappal } from "../../Assets";

const BannerBoxV2 = ({ image, info }) => {
  return (
    <div className="bannerBox w-full overflow-hidden rounded-md h-[200px] group relative">
      <img
        src={chappal}
        alt=""
        className="w-full group-hover:scale-105 transition-all duration-150"
      />
      <div
        className={`absolute top-[25px] right-[25px] w-[50%] pl-4 flex flex-col`}
      >
        <h6 className="font-[600] text-[18px] w-full">
          Buy Mens Footwear for Lower Price
        </h6>
        <p className="font-[600] text-[15px] text-primary">$129.00</p>
        <Link className="text-[14px] link font-[500] underline">SHOP NOW</Link>
      </div>
    </div>
  );
};

export default BannerBoxV2;
