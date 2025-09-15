import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import { product1 } from "../../Assets";
const ProductSlider = ({ items, products }) => {
  return (
    <div className="productSlider py-3 overflow-hidden">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        modules={[Navigation]}
        navigation={true}
        className="mySwiper"
      >
        {products?.map((product) => (
          <SwiperSlide key={product?._id}>
            <ProductCard product={product} image={product1} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
