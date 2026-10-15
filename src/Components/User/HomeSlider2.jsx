import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

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
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="homeSlide2"
    >
      <SwiperSlide>
        <div className="item rounded-md overflow-hidden w-full relative min-h-[420px] max-h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
            alt="banner"
            className="w-full h-[420px] object-cover"
          />
          <div className="info absolute top-0 -right-[100%] duration-500 opacity-0 transition-all w-[55%] h-[100%] flex flex-col justify-center z-50 p-8 bg-gradient-to-l from-white/95 via-white/80 to-transparent">
            <h4 className="text-[18px] font-[500] w-full mb-2 text-gray-800">
              Big Saving Days Sale
            </h4>
            <h2 className="text-[32px] font-[700] text-gray-900 leading-tight">
              Women Solid Round Green T-Shirt
            </h2>
            <h3 className="text-[18px] flex items-center gap-3 font-[500] w-full mb-3 mt-3 text-gray-800">
              Starting At Only{" "}
              <span className="text-[32px] font-[700] text-primary">
                $59.00
              </span>
            </h3>
            <div>
              <Button className="!mt-2 !bg-primary !text-white !px-6 !py-3 !font-[600] !rounded-md hover:!bg-red-600 transition-colors">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="item rounded-md overflow-hidden w-full relative min-h-[420px] max-h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
            alt="banner"
            className="w-full h-[420px] object-cover"
          />
          <div className="info absolute top-0 -right-[100%] duration-500 opacity-0 transition-all w-[55%] h-[100%] flex flex-col justify-center z-50 p-8 bg-gradient-to-l from-white/95 via-white/80 to-transparent">
            <h4 className="text-[18px] font-[500] w-full mb-2 text-gray-800">
              Exclusive Weekend Deal
            </h4>
            <h2 className="text-[32px] font-[700] text-gray-900 leading-tight">
              Trending Casuals & Streetwear
            </h2>
            <h3 className="text-[18px] flex items-center gap-3 font-[500] w-full mb-3 mt-3 text-gray-800">
              Starting At Only{" "}
              <span className="text-[32px] font-[700] text-primary">
                $39.00
              </span>
            </h3>
            <div>
              <Button className="!mt-2 !bg-primary !text-white !px-6 !py-3 !font-[600] !rounded-md hover:!bg-red-600 transition-colors">
                EXPLORE NOW
              </Button>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeSlider2;
