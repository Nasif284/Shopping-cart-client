import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Button } from "@mui/material";
import { useState } from "react";
import { useUnlistVariantMutation } from "../../Store/Api/admin/product";
import BlockConfirmModal from "./BlockConfirmModel";
import EditVariantModal from "./EditVariantModal";

const VariantListView = ({ variants, category }) => {
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [variant, setVariant] = useState();
  const [isBlocked, setIsBlocked] = useState();
  const [unlist, { isLoading: unlistLoading }] = useUnlistVariantMutation();
  const handleEdit = (variant) => {
    setOpen(true);
    setVariant(variant);
  };
  const toggleBlock = (id, isBlocked) => {
    setConfOpen(true);
    setVariant(id);
    setIsBlocked(isBlocked);
  };
  return (
    <>
      {variants?.map((variant) => (
        <div
          key={variant._id}
          className="productCard mb-3 rounded-md border bg-white border-[#d8d8d8] overflow-hidden shadow-md flex"
        >
          <div className="flex items-stretch w-[75%]">
            <div className="imgWrapper w-[25%] h-full group overflow-hidden relative transition-all">
              <Swiper
                navigation={true}
                modules={[Navigation]}
                className="mySwiper h-full"
              >
                {variant.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="image w-full h-full overflow-hidden">
                      <img
                        src={img}
                        alt={`variant-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="product-info px-8 w-[75%] py-5">
              <ul>
                <li>
                  <p className="text-[15px]">
                    <span className="font-[600]">Size :</span> {variant.size}
                  </p>
                </li>
                <li>
                  <p className="text-[15px] flex items-center gap-2">
                    <span className="font-[600]">Color :</span>
                    <span
                      className={`h-[15px] w-[15px] rounded-full flex`}
                      style={{ backgroundColor: variant.color }}
                    ></span>
                  </p>
                </li>
                <li>
                  <p className="text-[15px]">
                    <span className="font-[600]">Stock :</span> {variant.stock}
                  </p>
                </li>
                <li>
                  <p className="text-[15px]">
                    <span className="font-[600]">Discount :</span>{" "}
                    {variant.discount}%
                  </p>
                </li>
                <li>
                  <p className="text-[15px]">
                    <span className="font-[600]">Old Price :</span>{" "}
                    <span className="text-gray-500 font-[500] text-[15px]">
                      ${variant.oldPrice}
                    </span>
                  </p>
                </li>
                <li>
                  <p className="text-[15px]">
                    <span className="font-[600]">Price :</span>{" "}
                    <span className="text-primary font-[600] text-[15px]">
                      ${variant.price}
                    </span>
                  </p>
                </li>
              </ul>
              <div className="price-box flex items-center gap-4"></div>
            </div>
          </div>
          <div className="w-[10%] flex flex-col  justify-center gap-4 ml-auto pr-5 ">
            <Button
              onClick={() => handleEdit(variant)}
              className="!bg-green-500 !text-white !capitalize !text-[12px]"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleEdit(variant)}
              className="!bg-blue-500 !text-white !capitalize !text-[12px]"
            >
              Add Offer
            </Button>
            {variant.isUnlisted ? (
              <Button
                onClick={() => toggleBlock(variant._id, variant.isUnlisted)}
                className="!bg-green-500 !text-white !capitalize !text-[12px]"
              >
                list
              </Button>
            ) : (
              <Button
                onClick={() => toggleBlock(variant._id, variant.isUnlisted)}
                className="!bg-red-500 !text-white !capitalize !text-[12px]"
              >
                Unlist
              </Button>
            )}
          </div>
        </div>
      ))}
      {open && (
        <EditVariantModal
          open={open}
          handleClose={() => setOpen(false)}
          variant={variant}
          category={category}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          isBlocked={isBlocked}
          unlist={true}
          isLoading={unlistLoading}
          open={confOpen}
          block={unlist}
          handleClose={() => setConfOpen(false)}
          id={variant}
        />
      )}
    </>
  );
};

export default VariantListView;
