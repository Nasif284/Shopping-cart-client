import Button from "@mui/material/Button";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQty, increaseQty } from "../../Store/StoreSlices/cartSlice";
import toast from "react-hot-toast";
import { useEditItemQuantityMutation } from "../../Store/Api/user/cart";
import { CircularProgress } from "@mui/material";

const CartQtyBox = ({ item, i }) => {
  const { user } = useSelector((state) => state.userAuth);
  const [edit, { isLoading }] = useEditItemQuantityMutation();
  const dispatch = useDispatch();
  const handleQty = async (mode) => {
    if (user) {
      if (mode == "plus" && item.quantity >= 5) {
        return toast.error(
          `Adding more than 5 items is not allowed for per product `
        );
      }
       if (mode == "minus" && item.quantity == 1) {
         return toast.error(
           `less than 1 items is not allowed `
         );
       }
      try {
        await edit({ id: item._id, params: { mode } }).unwrap();
      } catch (error) {
        toast.error(error.data || "Some Error Occurred");
      }
    } else {
      if (mode == "plus") {
        if (item.variant.stock <= item.quantity) {
          toast.error(
            `Adding more than ${item.variant.stock} items is not allowed for this product `
          );
        } else if (item.quantity >= 5) {
          toast.error(
            `Adding more than 5 items is not allowed for per product `
          );
        } else {
          dispatch(increaseQty({ index: i }));
        }
      } else {
        dispatch(decreaseQty({ index: i }));
      }
    }
  };
  return (
    <div className="qtyBox w-full  h-full flex items-center relative bg-[#f1f1f1] border-1 border-[rgba(0,0,0,0.2)] rounded-md">
      {isLoading ? (
        <div className="w-full flex items-center pl-2">
          <CircularProgress size={10} />
        </div>
      ) : (
        <input
          type="number"
          value={item?.quantity}
          className="w-full h-full p-2 pl-3 text-[12px] focus:outline-none "
        />
      )}

      <div className="flex flex-col items-center h-full justify-between border-l-1 border-[rgba(0,0,0,0.2)] absolute top-0 right-0">
        <Button
          disabled={isLoading}
          className="!min-w-[15px] !h-[9px] !text-[8px] !text-black !rounded-none"
          onClick={() => handleQty("plus")}
        >
          <FaAngleUp />
        </Button>
        <Button
          disabled={isLoading}
          className="!min-w-[15px] !h-[9px] !text-[8px] !text-black !rounded-none"
          onClick={() => handleQty("minus")}
        >
          <FaAngleDown />
        </Button>
      </div>
    </div>
  );
};

export default CartQtyBox;
