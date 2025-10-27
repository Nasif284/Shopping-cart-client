import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import QtyBox from "./QtyBox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../../Store/StoreSlices/cartSlice";
import {
  useAddToCartMutation,
  useGetCartItemsQuery,
  useValidateProductMutation,
} from "../../Store/Api/user/cart";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { RiShoppingBag2Line } from "react-icons/ri";
import { createOrderItems } from "../../Store/StoreSlices/orderSlice";
import { useAddToWishlistMutation } from "../../Store/Api/user/wishlist";
const ProductDetailsComponent = ({
  product,
  activeVariant,
  setActiveVariant,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
  const [addToWishlist, { isLoading: wishlistLoading }] =
    useAddToWishlistMutation();
  const { user } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useGetCartItemsQuery();
  const [isExistInCart, setIsExistInCart] = useState(false);
  const [add, { isLoading }] = useAddToCartMutation();
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [validate] = useValidateProductMutation();
  const cart = useSelector((state) => state.cart);
  const addToWishListHandler = async () => {
    try {
      const res = await addToWishlist({
        product: product._id,
        variant: activeVariant._id,
      }).unwrap();
      toast.success(res.message || "Product Added To Wishlist Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleBuyNow = async () => {
    setBuyNowLoading(true);
    try {
      await validate({
        product: product._id,
        variant: activeVariant._id,
      }).unwrap();
      dispatch(
        createOrderItems({
          items: [{ product, variant: activeVariant, quantity: qty }],
          prices: {
            subtotal: activeVariant.oldPrice * qty,
            discount: activeVariant.oldPrice * qty - activeVariant.price * qty,
            total: activeVariant.price * qty,
          },
        })
      );
      setBuyNowLoading(false);
      navigate("/checkout");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
      setBuyNowLoading(false);
    }
  };

  const handleAddToCart = async (product, variant) => {
    if (user) {
      try {
        const res = await add({
          product: product._id,
          variant: variant._id,
          quantity: qty,
        }).unwrap();
        toast.success(res.message || "Product Added To Cart Successfully");
      } catch (error) {
        toast.error(error.data || "Some Error Occurred");
      }
    } else {
      setCartLoading(true);
      try {
        await validate({
          product: product._id,
          variant: variant._id,
        }).unwrap();
        dispatch(
          addToCart({
            product: product,
            variant: variant,
            quantity: 1,
          })
        );
        setCartLoading(false);
      } catch (error) {
        setCartLoading(false);
        toast.error(error.data || "Some Error Occurred");
      }
    }
  };
  useEffect(() => {
    setIsExistInCart(false);
    if (user) {
      const isExist = data?.items.find(
        (item) =>
          item.product._id == product?._id &&
          item.variant._id == activeVariant?._id
      );
      if (isExist) {
        setIsExistInCart(true);
      }
    } else {
      const isExist = cart.find(
        (item) =>
          item.product._id == product?._id &&
          item.variant._id == activeVariant?._id
      );
      if (isExist) {
        setIsExistInCart(true);
      } else {
        setIsExistInCart(false);
      }
    }
  }, [
    cart,
    product?._id,
    activeVariant?._id,
    user,
    data,
    selectedColor,
    selectedSize,
  ]);
  const [qty, setQty] = useState(1);
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
            <span className="text-[13px]">
              Reviews ({product?.reviewCount || 0})
            </span>
          </div>
          <div className="price-box flex items-center gap-4 mt-4">
            <span className="line-through text-gray-500 font-[500] text-[20px]">
              ₹{(activeVariant?.oldPrice * qty).toLocaleString()}
            </span>
            <span className="text-primary font-[600] text-[20px] ">
              ₹{(activeVariant?.price * qty).toLocaleString()}
            </span>
            <span className="text-primary font-[500] text-[15px] ">
              {activeVariant?.discount}%{" "}
              <span className="text-[10px]">OFF</span>
            </span>

            {activeVariant?.stock > 0 && (
              <span className="text-[14px]">
                Available in Stock:{" "}
                <span className="text-green-600 font-bold">
                  {activeVariant?.stock} Items
                </span>
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
            {activeVariant?.stock > 0 ? (
              <>
                {isExistInCart ? (
                  <Link to={"/cart"}>
                    <Button className="!bg-primary !text-white !text-[13px] !px-3 !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]">
                      <IoCartOutline className="!text-[19px]" />
                      Go To Cart
                    </Button>
                  </Link>
                ) : (
                  <>
                    <div className="qtyBoxWrapper w-[70px] h-[40px]">
                      <QtyBox
                        qty={qty}
                        product={activeVariant}
                        setQty={setQty}
                      />
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product, activeVariant)}
                      className="!bg-primary !text-white !text-[13px] !px-3 !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
                    >
                      {isLoading || cartLoading ? (
                        <CircularProgress size={30} color="inherit" />
                      ) : (
                        <>
                          <IoCartOutline className="!text-[19px]" />
                          Add To Cart
                        </>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <span className="text-[20px] text-red-500 font-[600]">
                Out of Stock
              </span>
            )}
            {activeVariant?.stock > 0 && (
              <Button
                onClick={handleBuyNow}
                className="!bg-primary !text-white !text-[13px] !px-3 !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
              >
                {buyNowLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>
                    <RiShoppingBag2Line className="!text-[19px]" />
                    Buy Now
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-5 mt-7">
            {!isExistInCart && (
              <button onClick={addToWishListHandler}>
                <span className="flex cursor-pointer font-[500] link text-[13px] items-center gap-2">
                  {wishlistLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <>
                      <FaRegHeart className="text-[18px]" />
                      Add To Wishlist
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetailsComponent;
