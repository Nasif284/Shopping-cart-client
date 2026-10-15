import React from "react";
import { Link } from "react-router-dom";
import { chappal } from "../../Assets";

const BannerBoxV2 = ({ image, info }) => {
  return (
    <div className="bannerBox w-full overflow-hidden rounded-md h-[200px] group relative bg-gray-100">
      <img
        src={image || chappal}
        alt="banner"
        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
      />
      <div
        className={`absolute top-[20px] right-[15px] w-[55%] p-3 flex flex-col justify-center bg-white/85 rounded-md backdrop-blur-xs`}
      >
        <h6 className="font-[600] text-[15px] leading-snug w-full text-gray-900">
          Exclusive Footwear & Accessories
        </h6>
        <p className="font-[700] text-[15px] text-primary mt-1">$49.00</p>
        <Link to="/search" className="text-[12px] link font-[600] text-primary underline mt-1">
          SHOP NOW
        </Link>
      </div>
    </div>
  );
};

export default BannerBoxV2;
