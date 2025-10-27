import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import CatBox from "./CatBox";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import { Link } from "react-router-dom";
const CatagorySlider = () => {
  const { data, isLoading } = useGetCategoriesByLevelQuery({ level: "first" });
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  const rootCats = data.categories.filter((cat) => !cat.isBlocked);
  return (
    <div className="catSlider py-8 pt-4 w-full  ">
      <div className="container overflow-hidden">
        <Swiper
          slidesPerView={7}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={true}
          className="catSwiper !flex !items-center !justify-center "
        >
          {rootCats.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link to={`/${cat.name.toLowerCase()}`}>
                <CatBox image={cat.image} title={cat.name} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CatagorySlider;
