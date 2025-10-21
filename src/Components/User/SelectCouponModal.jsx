import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useApplyCouponMutation, useGetCouponsForUserQuery } from "../../Store/Api/user/coupen";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { applyCoupon } from "../../Store/StoreSlices/orderSlice";
const SelectCouponModal = ({
  open,
  handleClose,
  purchaseValue,
  items,
  coupon,
}) => {
  const { data, isLoading } = useGetCouponsForUserQuery({ purchaseValue });
  const [apply, { isLoading: applyLoading }] = useApplyCouponMutation();
  const dispatch = useDispatch();
  const handleCouponSelection = async (code) => {
    if (coupon) {
      return toast.error(
        "Only One Coupon is Allowed , please remove selected coupon to select new one"
      );
    }
    try {
      const res = await apply({ code, items, purchaseValue }).unwrap();
      dispatch(
        applyCoupon({
          items: res.items,
          coupon: { ...res.coupon, deduction: res.couponDeduction },
        })
      );
        toast.success(res.message || "Coupon Applied Successfully");
        handleClose()
    } catch (error) {
      toast.error(error.data || "Some Error Occurred");
    }
  };
  if (isLoading || applyLoading) {
    <div className="w-full h-[100vh] flex items-center justify-center">
      <CircularProgress color="inherit" />
    </div>;
  }
  let coupons = data?.coupons;
  if (coupon) {
    coupons = data?.coupons.filter((c) => c.code != coupon.code);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className=" w-full">
          <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)] mb-3">
            <div className="head flex items-center justify-between">
              <h2>Coupons</h2>
            </div>
          </div>
          {coupons?.map((coupon) => (
            <div
              onClick={() => handleCouponSelection(coupon.code)}
              key={coupon?._id}
              className="card py-3 relative  shadow-md rounded-md flex w-[500px]"
            >
              <div className="address pl-3">
                <span className=" bg-[#f1f1f1] text-[13px] rounded-md py-1 px-2 font-[600] cursor-pointer ">
                  {coupon.code}
                </span>
                <div className="mt-2">
                  <h1>{coupon.description}</h1>
                  <p className="!mt-1">
                    Discount Value : {coupon.discountValue}{coupon.discountType == "Percentage" &&"%"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCouponModal;
