import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useRemoveFromWishlistMutation } from "../../Store/Api/user/wishlist";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../../Store/Api/user/cart";
import { IoCartOutline } from "react-icons/io5";
import { CircularProgress } from "@mui/material";
const MyListItems = ({ item }) => {
  const [remove] = useRemoveFromWishlistMutation();
  const [add, { isLoading }] = useAddToCartMutation();
  const removeHandler = async () => {
    try {
      await remove(item._id).unwrap();
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  const handleAddToCart = async () => {
    try {
      const res= await add({ product: item.product, variant: item.variant }).unwrap();
      toast.success(res.message || "Product Added to Cart");
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  return (
    <div className="cartItem w-full mb-2 pb-2 border-b border-[rgba(0,0,0,0.1)] flex items-center gap-4 relative">
      <IoMdClose
        onClick={removeHandler}
        className="absolute top-[5px] right-[15px] cursor-pointer text-[22px] link transition-all"
      />
      <div className="img min-w-[25%] w-[25%] min-h-[160px] h-[160px] rounded-md overflow-hidden">
        <Link>
          <img
            className="w-full object-cover"
            src={item.variant.images[0]}
            alt=""
          />
        </Link>
      </div>
      <div className="w-[75%] pr-5">
        <span className="text-[11px]">{item.product.brand}</span>
        <Link className="link">
          <h3 className="text-[13px] ">{item.product.name}</h3>
        </Link>
        <div className="flex gap-3">
          <p className="!text-[12px] !m-0 text-gray-600">
            Size: {item.variant.size}
          </p>
          <p className="!text-[12px] !m-0 text-gray-600 flex items-center gap-2">
            Color:
            <span
              className={`h-[15px] flex w-[15px] rounded-full border border-gray-300`}
              style={{ backgroundColor: item.variant.color }}
            ></span>
          </p>
        </div>

        <Rating
          className="mt-1"
          value={item.product.rating}
          name="size-small"
          defaultValue={2}
          size="small"
          readOnly
        />
        <div className="price-box flex items-center mt-1 gap-4">
          <span className="text-primary font-[600] text-[12px] ">
            ${item.variant.price}
          </span>
          <span className="line-through text-gray-500 font-[500] text-[14px]">
            ${item.variant.oldPrice}
          </span>
          <span className="text-primary font-[600] text-[12px] ">
            {item.variant.discount}% OFF
          </span>
        </div>
        <Button
          onClick={handleAddToCart}
          className="!bg-primary !text-white !text-[10px] !px-3 !py-1 !mt-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[500]"
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              <IoCartOutline className="!text-[19px]" />
              Add To Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MyListItems;
