import React from "react";
import { Link } from "react-router-dom";
import { chappal } from "../../Assets";

const BannerBoxV2 = ({
  image,
  title = "Exclusive Footwear & Accessories",
  price = "$29.00",
  link = "/footwear",
  info = "right",
}) => {
  return (
    <div className="bannerBox w-full overflow-hidden rounded-md h-[200px] group relative bg-gray-100 shadow-sm">
      <Link to={link} className="block w-full h-full">
        <img
          src={image || chappal}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        />
      </Link>
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          info === "left" ? "left-[14px]" : "right-[14px]"
        } w-[58%] max-w-[210px] p-3.5 flex flex-col justify-center bg-white/92 rounded-lg backdrop-blur-md shadow-md border border-white/70 z-10`}
      >
        <h6 className="font-[700] text-[14px] leading-tight text-gray-900 line-clamp-2">
          {title}
        </h6>
        <p className="text-[12px] text-gray-600 font-[500] mt-1.5 leading-snug">
          Starting from{" "}
          <span className="font-[700] text-[15px] text-primary block sm:inline">
            {price}
          </span>
        </p>
        <Link
          to={link}
          className="text-[12px] font-[700] text-primary hover:text-red-700 tracking-wide mt-2 inline-flex items-center gap-1 group/btn w-fit"
        >
          <span>SHOP NOW</span>
          <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BannerBoxV2;
