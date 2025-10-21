import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../Store/StoreSlices/cartSlice";
import { useRemoveFromCartMutation } from "../../Store/Api/user/cart";
import toast from "react-hot-toast";
import CartQtyBox from "./CartQtyBox";

const CartItem = ({ item, i }) => {
  const dispatch = useDispatch();
  const [remove] = useRemoveFromCartMutation();
  const { user } = useSelector((state) => state.userAuth);
  const handleRemoveFromCart = async () => {
    if (user) {
      try {
        const res = await remove(item._id).unwrap();
        toast.success(res.message || "Product Removed From Cart Successfully");
      } catch (error) {
        toast.error(error.data || "Some Error Occurred");
      }
    } else {
      dispatch(removeFromCart({ index: i }));
    }
  };
  return (
    <div className="cartItem w-full mb-3 pb-5 border-b border-[rgba(0,0,0,0.1)] flex items-center gap-4 relative">
      <IoMdClose
        onClick={handleRemoveFromCart}
        className="absolute top-[5px] right-[15px] cursor-pointer text-[22px] link transition-all"
      />
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link>
          <img className="w-full" src={item?.variant?.images[0]} />
        </Link>
      </div>
      <div className="w-[85%]">
        <span className="text-[13px]">{item.product.brand}</span>
        <Link className="link">
          <h3 className="text-[15px] ">{item.product.name}</h3>
        </Link>
        <Rating
          className="mt-2"
          name="size-small"
          defaultValue={2}
          size="small"
          readOnly
        />
        {!item.variant.isUnlisted &&
        !item.product.isUnlisted &&
        !item.product.categoryId.isBlocked &&
        !item.product.subCategoryId.isBlocked &&
        !item.product.thirdSubCategoryId.isBlocked ? (
          <>
            {item.variant.stock > 0 ? (
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[12px] font-[500]">Quantity :</span>
                    <div className="cartQtyBoxWrapper w-[50px] h-[23px] flex">
                      <CartQtyBox item={item} i={i} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[15px] text-red-500 font-[600]">
                  Out of Stock
                </span>
              </div>
            )}
          </>
        ) : (
          <div>
            <span className="text-[15px] text-red-500 font-[600]">
              Not Available
            </span>
          </div>
        )}

        <div className="price-box flex items-center mt-2 gap-4">
          <span className="text-primary font-[600] text-[14px] ">
            ₹{(item.variant.price * item.quantity).toLocaleString()}
          </span>
          <span className="line-through text-gray-500 font-[500] text-[14px]">
            ₹{(item.variant.oldPrice * item.quantity).toLocaleString()}
          </span>
          <span className="text-primary font-[600] text-[14px] ">
            {item.variant.discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
