import Drawer from "@mui/material/Drawer";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../Store/StoreSlices/cartSlice";
import { useEffect, useState } from "react";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
} from "../../Store/Api/user/cart";
import toast from "react-hot-toast";
import CartQtyBox from "./CartQtyBox";
import { createOrderItems } from "../../Store/StoreSlices/orderSlice";
import _ from "lodash";
const CartPanel = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.userAuth);
  const cart = useSelector((state) => state.cart);
  const { data } = useGetCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [items, setItems] = useState();
  const dispatch = useDispatch();
  let filtered = data?.items.filter(
    (e) =>
      e.variant.stock > 0 &&
      !e.variant.isUnlisted &&
      !e.product.isUnlisted &&
      !e.product.categoryId.isBlocked &&
      !e.product.subCategoryId.isBlocked &&
      !e.product.thirdSubCategoryId.isBlocked
  );
  const handleCheckout = () => {
    dispatch(
      createOrderItems({
        items: filtered,
        prices: {
          subtotal: totalOldPrice,
          discount: totalOldPrice - totalPrice,
          total: totalPrice,
        },
      })
    );
    setOpen(false);
  };
  let totalOldPrice, totalPrice;
  if (user) {
    totalOldPrice = filtered?.reduce(
      (acc, cur) => acc + cur.variant.oldPrice * cur.quantity,
      0
    );
    totalPrice = filtered?.reduce(
      (acc, cur) => acc + cur.variant.price * cur.quantity,
      0
    );
  } else {
    totalOldPrice = cart.reduce((acc, cur) => acc + cur.variant.oldPrice, 0);
    totalPrice = cart.reduce((acc, cur) => acc + cur.variant.price, 0);
  }
  const [remove] = useRemoveFromCartMutation();
  const handleRemoveFromCart = async (id, i) => {
    if (user) {
      try {
        const res = await remove(id).unwrap();
        toast.success(res.message || "Product Removed From Cart Successfully");
      } catch (error) {
        toast.error(error.data || "Some Error Occurred");
      }
    } else {
      dispatch(removeFromCart({ index: i }));
    }
  };

  useEffect(() => {
    if (user) {
      setItems(data?.items);
    } else {
      setItems(cart);
    }
  }, [data, cart, user]);
  return (
    <Drawer
      className="cartPanel"
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)]">
        <h1>Shopping Cart ({items?.length})</h1>
        <IoMdClose
          className="cursor-pointer text-[20px] "
          onClick={() => setOpen(false)}
        />
      </div>
      <div className="drawerMain flex flex-col justify-between h-full">
        <div className="scroll w-full max-h-[435px] overflow-y-scroll overflow-x-hidden py-3 px-4  ">
          {items?.map((item, i) => (
            <div
              key={item.product._id}
              className="cartItem w-full flex items-center gap-4 border-b mb-4 border-[rgba(0,0,0,0.1)] pb-3"
            >
              <div className="img w-[25%] h-[80px] rounded-md overflow-hidden">
                <img src={item.variant.images[0]} alt="" />
              </div>
              <div className="info w-[75%] pr-5 relative">
                <Link className="link">
                  <h4 className="text-[15px] font-[500]">
                    {item.product.name}
                  </h4>
                </Link>
                <div className="flex items-center gap-5 mt-4">
                  {!item.variant.isUnlisted &&
                  !item.product.isUnlisted &&
                  !item.product.categoryId.isBlocked &&
                  !item.product.subCategoryId.isBlocked &&
                  !item.product.thirdSubCategoryId.isBlocked ? (
                    <>
                      {item.variant.stock > 0 ? (
                        <div className="flex gap-2 items-center ">
                          <span className="text-[14px] font-[500]">Qty :</span>
                          <div className="cartQtyBoxWrapper w-[50px] h-[23px] flex">
                            <CartQtyBox item={item} i={i} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[15px] text-red-500 font-[600]">
                          Out of Stock
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[15px] text-red-500 font-[600]">
                      Not Available
                    </span>
                  )}

                  <span className="text-primary font-bold text-[14px]">
                    Price : ₹
                    {(item.variant.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                <MdDeleteOutline
                  onClick={() => handleRemoveFromCart(item._id, i)}
                  className="absolute !text-[20px] link top-[5px] right-[10px] cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-info py-3  px-4 w-full border-t border-[rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.1)]">
            <p className="font-[600] !text-[15px]">
              Items ({filtered?.length})
            </p>
            <p className="text-primary font-bold">
              ₹{totalOldPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.1)]">
            <p className="font-[600] !text-[15px]">Discount:</p>
            <p className="text-primary font-bold">
              -₹{(totalOldPrice - totalPrice).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-[600] !text-[15px]">Total (tax excl.)</p>
            <p className="text-primary font-bold">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Link
              onClick={() => setOpen(false)}
              className={`${filtered.length > 0 ? "w-[50%]" : "w-full"}`}
              to={"/cart"}
            >
              <Button className="!bg-primary !rounded-md !text-white w-full !font-[500]">
                View Cart
              </Button>
            </Link>
            {filtered?.length > 0 && (
              <Link
                onClick={handleCheckout}
                className="w-[50%]"
                to={"/checkout"}
              >
                <Button className="!bg-white  !rounded-md !text-primary !border-2 border-primary  w-full !font-[500]">
                  Checkout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

CartPanel.displayName = "CartPanel component";
export default CartPanel;
