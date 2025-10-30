import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";
import { CartItem } from "../../Components/User";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartItemsQuery } from "../../Store/Api/user/cart";
import { useEffect, useState } from "react";
import { createOrderItems } from "../../Store/StoreSlices/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const { user } = useSelector((state) => state.userAuth);
  const cart = useSelector((state) => state.cart);
  const { data } = useGetCartItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate()
  let filtered = data?.items.filter(
    (e) =>
      e.variant.stock > 0 &&
      !e.variant.isUnlisted &&
      !e.product.isUnlisted &&
      !e.product.categoryId.isBlocked &&
      !e.product.subCategoryId.isBlocked &&
      !e.product.thirdSubCategoryId.isBlocked
  );
  const [items, setItems] = useState();
  const dispatch = useDispatch();
  let totalOldPrice, totalPrice;
  const handleCheckout = () => {
    if (!user) {
      return toast.error("Please Login to Proceed with Checkout");
    }
    if (filtered.length == 0) {
      return toast.error("No products in the cart");
    }
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
    navigate("/checkout")
  };
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
  useEffect(() => {
    if (user) {
      setItems(data?.items);
    } else {
      setItems(cart);
    }
  }, [data, cart, user]);

  return (
    <section className="py-5 ">
      <div className="container flex w-[80%] max-w-[80%] pb-10 gap-4">
        <div className="leftPart w-[75%] shadow-md rounded-md p-3 bg-white">
          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <h2>Your Cart</h2>
            <p className="!mt-0">
              There are{" "}
              <span className="font-bold text-primary">{items?.length}</span>{" "}
              Items in your cart
            </p>
          </div>
          {items?.map((item, i) => (
            <CartItem item={item} i={i} />
          ))}
        </div>
        <div className="w-[25%] rightPart">
          <div className="bg-white rounded-md shadow-md p-5">
            <h3>Cart Totals</h3>
            <div className="py-5">
              <p className="flex text-[14px] justify-between !m-0">
                Subtotal{" "}
                <span className=" font-bold text-primary">
                  ₹{totalOldPrice}
                </span>
              </p>
              <p className="flex text-[14px] justify-between !m-0">
                Discount
                <span className=" font-bold text-primary">
                  -₹{totalOldPrice - totalPrice}
                </span>
              </p>
              <p className="flex text-[14px] justify-between !m-0">
                Total{" "}
                <span className=" font-bold text-primary">₹{totalPrice}</span>
              </p>
            </div>
            {filtered?.length > 0 && (

                <Button
                  onClick={handleCheckout}
                  type="submit"
                  className="!bg-primary w-full !mt-2 !text-white !text-[14px] !py-2 flex gap-2  hover:!bg-[rgba(0,0,0,0.8)] !font-[600]"
                >
                  <IoBagCheckOutline className="text-[16px]" />
                  Checkout
                </Button>

            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
