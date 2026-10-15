import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import BannerBoxV2 from "./BannerBoxV2";
const AdsBannerSliderV2 = ({ items }) => {
  return (
    <div className="py-5 w-full overflow-hidden">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        modules={[Navigation]}
        navigation={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2
            info="left"
            image="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AdsBannerSliderV2;
