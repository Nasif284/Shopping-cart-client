import React, { useRef, useState } from "react";
import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
const ProductZoom = ({ variant }) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();
  const goto = (index) => {
    setSliderIndex(index);
    zoomSliderSml.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };
  return (
    <div className="flex gap-3 ">
      <div className="slider w-[15%]">
        <Swiper
          ref={zoomSliderSml}
          direction={"vertical"}
          slidesPerView={5}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          className="zoomSlider h-[500px] overflow-hidden "
        >
          {variant?.images?.map((img, i) => (
            <SwiperSlide key={i} className="!mb-3">
              <div
                className={`item rounded-md group cursor-pointer overflow-hidden ${sliderIndex === i ? "opacity-100" : "opacity-30"}`}
                onClick={() => goto(i)}
              >
                <img
                  src={img}
                  className="w-full group-hover:scale-110 "
                  alt=""
                />
              </div>
            </SwiperSlide>
          ))}
          <SwiperSlide></SwiperSlide>
        </Swiper>
      </div>
      <div className="zoomContainer h-[500px] overflow-hidden  w-[85%]">
        <Swiper ref={zoomSliderBig} slidesPerView={1} className="mySwiper">
          {variant?.images?.map((img, i) => (
            <SwiperSlide key={i}>
              <InnerImageZoom zoomType={"hover"} zoomScale={1} src={img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductZoom;
