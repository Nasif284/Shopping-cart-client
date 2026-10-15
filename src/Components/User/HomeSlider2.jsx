import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import Button from "@mui/material/Button";

const HomeSlider2 = () => {
  return (
    <Swiper
      loop={true}
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="homeSlide2"
    >
      <SwiperSlide>
        <div className="item rounded-md overflow-hidden w-full relative min-h-[420px] max-h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
            alt="Women Fashion Sale"
            className="w-full h-[420px] object-cover"
          />
          <div className="info absolute top-0 -right-[100%] duration-500 opacity-0 transition-all w-full sm:w-[65%] md:w-[60%] lg:w-[55%] h-full flex flex-col justify-center items-end z-20 pr-12 md:pr-14">
            <div className="bg-white/92 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/60 max-w-[390px] w-full text-left">
              <span className="inline-block text-[12px] font-[700] tracking-wider uppercase text-primary bg-red-50 border border-primary/20 px-3 py-1 rounded-full mb-2.5">
                Big Saving Days Sale
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-[800] text-gray-900 leading-tight">
                Women Solid Round Green T-Shirt
              </h2>
              <div className="flex items-baseline gap-2 mt-2.5 mb-3">
                <span className="text-[14px] font-[500] text-gray-600">
                  Starting At Only
                </span>
                <span className="text-[26px] font-[800] text-primary">
                  $59.00
                </span>
              </div>
              <Link to="/fashion" className="inline-block">
                <Button className="!bg-primary !text-white !px-6 !py-2.5 !font-[600] !text-[13px] !rounded-lg hover:!bg-[#e04343] transition-colors shadow-md">
                  SHOP NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="item rounded-md overflow-hidden w-full relative min-h-[420px] max-h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
            alt="Weekend Deals"
            className="w-full h-[420px] object-cover"
          />
          <div className="info absolute top-0 -right-[100%] duration-500 opacity-0 transition-all w-full sm:w-[65%] md:w-[60%] lg:w-[55%] h-full flex flex-col justify-center items-end z-20 pr-12 md:pr-14">
            <div className="bg-white/92 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/60 max-w-[390px] w-full text-left">
              <span className="inline-block text-[12px] font-[700] tracking-wider uppercase text-primary bg-red-50 border border-primary/20 px-3 py-1 rounded-full mb-2.5">
                Exclusive Weekend Deal
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-[800] text-gray-900 leading-tight">
                Trending Casuals & Streetwear
              </h2>
              <div className="flex items-baseline gap-2 mt-2.5 mb-3">
                <span className="text-[14px] font-[500] text-gray-600">
                  Starting At Only
                </span>
                <span className="text-[26px] font-[800] text-primary">
                  $39.00
                </span>
              </div>
              <Link to="/fashion" className="inline-block">
                <Button className="!bg-primary !text-white !px-6 !py-2.5 !font-[600] !text-[13px] !rounded-lg hover:!bg-[#e04343] transition-colors shadow-md">
                  EXPLORE NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeSlider2;
