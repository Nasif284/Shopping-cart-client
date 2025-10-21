import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { SelectField } from "../Admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { couponSchema } from "../../Utils/YupSchemas";
import DateField from "./DateFiled";
import {
  useEditCouponMutation,
} from "../../Store/Api/admin/coupon";
import dayjs from "dayjs";
const EditCouponModal = ({ open, handleClose, coupon }) => {
  const [edit, { isLoading }] = useEditCouponMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(couponSchema),
    defaultValues: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount,
      scope: coupon.scope,
      usageLimit: coupon.usageLimit,
      startDate: coupon?.startDate ? dayjs(coupon.startDate) : null,
      expiryDate: coupon?.expiryDate ? dayjs(coupon.expiryDate) : null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await edit({
        id: coupon._id,
        data: {
          ...data,
          expiryDate: new Date(data.expiryDate).toISOString(),
          startDate: new Date(data.startDate).toISOString(),
        },
      }).unwrap();
      toast.success(res.message || "Coupon Edited Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Error occurred");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div>
          <h2 className="text-[18px] font-[600]">Edit Coupon</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex gap-3 flex-wrap">
              <div className="w-full gap-4 flex justify-between">
                <TextField
                  {...register("code")}
                  error={!!errors.code?.message}
                  helperText={errors.code?.message}
                  label="Code"
                  variant="outlined"
                  className="w-[50%]"
                />
                <SelectField
                  name="discountType"
                  control={control}
                  errors={errors}
                  label="Type"
                  options={["Percentage", "Flat"]}
                  width="50%"
                />
              </div>
            </div>
            <div className="w-full gap-4 flex justify-between">
              <TextField
                {...register("description")}
                error={!!errors.description?.message}
                helperText={errors.description?.message}
                label="Description"
                variant="outlined"
                className="w-full"
              />
            </div>
            <div className="w-full gap-4 flex justify-between">
              <TextField
                {...register("discountValue")}
                error={!!errors.discountValue?.message}
                helperText={errors.discountValue?.message}
                label="Discount Value"
                variant="outlined"
                className="w-[50%]"
              />
              <TextField
                {...register("minPurchaseAmount")}
                error={!!errors.minPurchaseAmount?.message}
                helperText={errors.minPurchaseAmount?.message}
                label="Min Purchase Value"
                variant="outlined"
                className="w-[50%]"
              />
            </div>
            <div className="w-full gap-4 flex justify-between">
              <SelectField
                name="scope"
                control={control}
                errors={errors}
                label="Scope"
                options={["Global", "First Order"]}
                width="50%"
              />
              <TextField
                {...register("usageLimit")}
                error={!!errors.usageLimit?.message}
                helperText={errors.usageLimit?.message}
                label="Usage Limit"
                variant="outlined"
                className="w-[50%]"
              />
            </div>
            <div className="w-full gap-4 flex justify-between">
              <DateField
                name={"startDate"}
                label={"Starts From"}
                control={control}
                errorMessage={errors.startDate?.message}
              />
              <DateField
                name={"expiryDate"}
                label={"Expires At"}
                control={control}
                errorMessage={errors.expiryDate?.message}
              />
            </div>

            <div className="w-full flex gap-3">
              <Button
                type="submit"
                className="!flex w-[50%]  !bg-green-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>Save </>
                )}
              </Button>
              <Button
                onClick={handleClose}
                className="!flex w-[50%]  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCouponModal;
