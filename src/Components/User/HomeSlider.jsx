import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetHomeSlidesQuery } from "../../Store/Api/admin/homeSlides";
const HomeSlider = () => {
  const { data } = useGetHomeSlidesQuery({ user: true });
  return (
    <div className="homeSlider py-3">
      <div className="container">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
        >
          {data?.homeSlides.map((slide) => (
            <SwiperSlide key={slide._id}>
              <div className="item rounded-[20px] overflow-hidden">
                <img src={slide.banner} alt="" className="w-full" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
