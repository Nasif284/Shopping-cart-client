import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline, IoGitCompareOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen, setProductId } from "../../Store/StoreSlices/uiSlice";
import { addToCart } from "../../Store/StoreSlices/cartSlice";
import {
  useAddToCartMutation,
  useGetCartItemsQuery,
} from "../../Store/Api/user/cart";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { useAddToWishlistMutation } from "../../Store/Api/user/wishlist";

const ProductCard = ({
  product = {
    _id: "",
    name: "Unnamed Product",
    brand: "Unknown Brand",
    defaultVariant: {
      images: [
        "https://www.jiomart.com/images/product/original/442600385_orange/boys-checked-slim-fit-shirt-model-442600385_orange-0-202502261002.jpg?im=Resize=(600,750)",
        "https://www.jiomart.com/images/product/original/442600385_orange/boys-checked-slim-fit-shirt-model2-442600385_orange-2-202502261002.jpg?im=Resize=(600,750)",
      ],
      discount: 0,
      oldPrice: 0,
      price: 0,
    },
  },
}) => {
  const [addToWishlist, { isLoading: wishlistLoading }] =
    useAddToWishlistMutation();
    const { user } = useSelector((state) => state.userAuth);
  const addToWishListHandler = async () => {
      if (!user) {
        return toast.error("Please Login to Buy this Product");
      }
    try {
      const res = await addToWishlist({
        product: product._id,
        variant: product.defaultVariant._id,
      }).unwrap();
      toast.success(res.message || "Product Added To Wishlist Successfully");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };

  const dispatch = useDispatch();
  const [isExistInCart, setIsExistInCart] = useState(false);
  const [add, { isLoading }] = useAddToCartMutation();
  const { data } = useGetCartItemsQuery();
  const cart = useSelector((state) => state.cart);

  const handleAddToCart = async (product, variant) => {
    if (user) {
      try {
        const res = await add({
          product: product._id,
          variant: variant._id,
        }).unwrap();
        toast.success(res.message || "Product Added To Cart Successfully");
      } catch (error) {
        toast.error(error.data || "Some Error Occurred");
      }
    } else {
      dispatch(
        addToCart({
          product: product,
          variant: variant,
          quantity: 1,
        })
      );
    }
  };
  useEffect(() => {
    if (user) {
      const isExist = data?.items.find(
        (item) =>
          item.product._id == product?._id &&
          item.variant._id == product.defaultVariant?._id
      );

      setIsExistInCart(!!isExist);
    } else {
      const isExist = cart.find(
        (item) =>
          item.product._id == product?._id &&
          item.variant._id == product.defaultVariant?._id
      );
      setIsExistInCart(!!isExist);
    }
  }, [cart, product?._id, product.defaultVariant?._id, user, data]);
  return (
    <div className="productCard rounded-md border border-[#d8d8d8] overflow-hidden shadow-md h-[380px] flex flex-col justify-between">
      <div className="imgWrapper w-[100%] group overflow-hidden rounded-t-md relative transition-all">
        <Link>
          <div className="image overflow-hidden">
            <img
              src={product.defaultVariant.images[0]}
              alt=""
              className="w-full h-[220px] object-cover object-top"
            />
            <img
              src={product.defaultVariant.images[1]}
              alt=""
              className="w-full h-[220px] object-top object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>
        <span className="discount flex items-center absolute top-[10px] left-[10px] bg-primary text-white z-50 rounded-lg p-1 text-[10px] font-[500]">
          {product.defaultVariant.discount}%
        </span>
        <div className="actions duration-300 transition-all absolute group-hover:top-[10px] right-[15px] top-[-200px] flex-col flex z-50 items-center gap-2">
          <Tooltip title={"zoom"} placement="left">
            <Button
              onClick={() => {
                dispatch(setModalOpen(true));
                dispatch(setProductId(product._id));
              }}
              className="!w-[35px] !text-[18px]  !h-[35px] !min-w-[35px] !bg-white !rounded-full hover:!bg-primary !text-black hover:!text-white transition-all"
            >
              <MdOutlineZoomOutMap />
            </Button>
          </Tooltip>
          {!isExistInCart && (
            <Tooltip title={"Add to Wish list"} placement="left">
              <Button
                onClick={addToWishListHandler}
                className="!w-[35px] !text-[18px] !h-[35px] !min-w-[35px] !bg-white !rounded-full hover:!bg-primary !text-black hover:!text-white transition-all"
              >
                {wishlistLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <>
                    <FaRegHeart />
                  </>
                )}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <Link to={`/product/${product._id}`}>
        <div className="product-info px-3 py-5">
          <h6 className="text-[13px]">
            <Link className="link transition-all">{product.brand}</Link>
          </h6>
          <h3 className="text-[14px] leading-[18px] mt-1 font-[500] mb-1">
            <Tooltip title={product.name} placement="top">
              <Link
                to={`/product/${product._id}`}
                className="link transition-all block w-full truncate"
              >
                {product.name}
              </Link>
            </Tooltip>
          </h3>
          <Rating
            name="size-small"
            value={product.rating}
            defaultValue={2}
            size="small"
            readOnly
          />
          <div className="price-box flex items-center gap-4">
            <span className="line-through text-gray-500 font-[500] text-[15px]">
              ₹{product.defaultVariant.oldPrice.toLocaleString()}
            </span>
            <span className="text-primary font-[600] text-[15px] ">
              ₹{product.defaultVariant.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        {product.defaultVariant.stock > 0 ? (
          <>
            {isExistInCart ? (
              <Link to={"/cart"}>
                <Button className="!bg-white flex gap-3 !rounded-md !text-primary !border-2 border-primary  w-full !font-[500]">
                  <IoCartOutline className="!text-[19px] !text-black" />
                  Go to Cart
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => handleAddToCart(product, product.defaultVariant)}
                className="!bg-white flex gap-3 !rounded-md !text-primary !border-2 border-primary  w-full !font-[500]"
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>
                    <IoCartOutline className="!text-[19px]" />
                    Add To Cart
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <div className="flex items-center py-2 justify-center text-center w-full">
            <span className="text-[15px] text-center text-red-500 font-[600]">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
