import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoCartOutline, IoGitCompareOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import QtyBox from "./QtyBox";
const ProductDetailsComponent = ({
  product,
  activeVariant,
  setActiveVariant,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const firstSize = product.groupedVariants[color].variants[0].size;
    setSelectedSize(firstSize);
    setActiveVariant(
      product.groupedVariants[color].variants.find((v) => v.size == firstSize)
    );
  };
  return (
    <>
      {product && (
        <>
          <h1 className="text-[22px] font-[600] mb-2">{product?.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-[13px]">
              Brand:{" "}
              <span className="font-[500] text-black">{product?.brand}</span>
            </span>
            <Rating
              name="size-small"
              value={product?.rating}
              size="small"
              readOnly
            />
            <span className="text-[13px]">Reviews (5)</span>
          </div>
          <div className="price-box flex items-center gap-4 mt-4">
            <span className="line-through text-gray-500 font-[500] text-[20px]">
              ${activeVariant?.oldPrice}
            </span>
            <span className="text-primary font-[600] text-[20px] ">
              ${activeVariant?.price}
            </span>
            {activeVariant?.stock > 0 ? (
              <span className="text-[14px]">
                Available in Stock:{" "}
                <span className="text-green-600 font-bold">
                  {activeVariant?.stock} Items
                </span>
              </span>
            ) : (
              <span className="text-[14px] text-red-500 font-bold">
                Out of Stock
              </span>
            )}
          </div>
          <p className="text-[14px] leading-[25px] mt-3 pr-[10px] mb-5">
            {product.description}
          </p>
          {selectedColor != "#0" && (
            <div className="flex items-center gap-2 mt-3 mb-3">
              <span className="text-[16px]">Color:</span>
              {Object.keys(product.groupedVariants).map((color) => (
                <button
                  onClick={() => handleColorChange(color)}
                  className={` w-[25px] h-[25px] rounded-full flex items-center justify-center ${color == selectedColor && "border-2 border-black"}`}
                  key={product._id}
                >
                  <span
                    style={{ backgroundColor: color }}
                    className={`flex h-[20px] w-[20px] rounded-full cursor-pointer border-white border-2`}
                  ></span>
                </button>
              ))}
            </div>
          )}

          {}
          {product?.groupedVariants[selectedColor]?.variants[0].size && (
            <div className="flex items-center gap-3">
              <span className="text-[16px]">Size:</span>
              <div className="sizes flex items-center gap-1">
                {selectedColor &&
                  product.groupedVariants[selectedColor].variants.map(
                    (variant) => {
                      return (
                        <Button
                          key={variant.size}
                          onClick={() => {
                            setSelectedSize(variant.size);
                            setActiveVariant(variant);
                          }}
                          className={`${selectedSize === variant.size ? "!bg-primary !text-white" : "!text-black"}`}
                        >
                          {variant.size}
                        </Button>
                      );
                    }
                  )}
              </div>
            </div>
          )}

          <p className="text-[14px] mt-4 !text-[rgba(0,0,0,0.7)]">
            Free Shipping (Est. Delivery Time 2-3 Days)
          </p>
          <div className="flex items-center mt-4 gap-4">
            <div className="qtyBoxWrapper w-[70px] h-[40px]">
              <QtyBox />
            </div>
            <Button className="!bg-primary !text-white !text-[13px] !px-3 !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]">
              <IoCartOutline className="!text-[19px]" />
              Add To Cart
            </Button>
          </div>
          <div className="flex items-center gap-5 mt-7">
            <span className="flex cursor-pointer font-[500] link text-[13px] items-center gap-2">
              <FaRegHeart className="text-[18px]" />
              Add To Wishlist
            </span>
            <span className="flex link cursor-pointer font-[500] text-[13px] items-center gap-2">
              <IoGitCompareOutline className="text-[18px]" />
              Add To Compare
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetailsComponent;
